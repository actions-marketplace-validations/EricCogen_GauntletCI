// SPDX-License-Identifier: Elastic-2.0
using System.Text.RegularExpressions;
using GauntletCI.Core.Diff;

namespace GauntletCI.Core.Analysis;

/// <summary>
/// Detects sibling class implementations that apply opposite boolean polarity to the same predicate (PG-RELATION).
/// </summary>
internal static class PairedImplementationAnalyzer
{
    private static readonly Regex ClassDeclarationRegex =
        new(@"\b(?:class|record|struct)\s+(\w+)", RegexOptions.Compiled);

    private static readonly Regex MethodDeclarationRegex =
        new(@"\b(?:public|private|protected|internal)\s+(?:static\s+)?(?:override\s+)?(?:async\s+)?[\w<>\[\]?]+\s+(\w+)\s*\(",
            RegexOptions.Compiled);

    private static readonly Regex ConditionalRegex =
        new(@"\b(?:if|while)\s*\((.+?)\)", RegexOptions.Compiled);

    private static readonly Regex TernaryConditionRegex =
        new(@"([^?:]+)\?", RegexOptions.Compiled);

    internal sealed record ConditionObservation(
        string ClassName,
        string MethodName,
        int LineNumber,
        string Condition,
        string Callee,
        bool IsNegated,
        bool IsAddedLine);

    internal static IReadOnlyList<ConditionObservation> AnalyzeFile(DiffFile file)
    {
        var observations = new List<ConditionObservation>();
        var orderedLines = file.Hunks
            .SelectMany(h => h.Lines)
            .Where(l => l.Kind is DiffLineKind.Added or DiffLineKind.Context)
            .OrderBy(l => l.LineNumber)
            .ToList();

        string? currentClass = null;
        string? currentMethod = null;

        foreach (var line in orderedLines)
        {
            var content = line.Content;
            var classMatch = ClassDeclarationRegex.Match(content);
            if (classMatch.Success)
                currentClass = classMatch.Groups[1].Value!;

            var methodMatch = MethodDeclarationRegex.Match(content);
            if (methodMatch.Success)
                currentMethod = methodMatch.Groups[1].Value!;

            if (currentClass is null || currentMethod is null)
                continue;

            var conditionSources = CollectConditionSources(content);
            if (conditionSources.Count == 0)
                continue;

            foreach (var conditionText in conditionSources)
            {
                foreach (var extracted in ExtractConditions(conditionText))
                {
                    observations.Add(new ConditionObservation(
                        currentClass,
                        currentMethod,
                        line.LineNumber,
                        extracted.Condition,
                        extracted.Callee,
                        extracted.IsNegated,
                        line.Kind == DiffLineKind.Added));
                }
            }
        }

        return observations;
    }

    internal static IReadOnlyList<(ConditionObservation Left, ConditionObservation Right)> FindPolarityMismatches(
        IReadOnlyList<ConditionObservation> observations)
    {
        var mismatches = new List<(ConditionObservation, ConditionObservation)>();

        var groups = observations
            .GroupBy(o => (o.MethodName, o.Callee))
            .Where(g => g.Select(x => x.ClassName).Distinct(StringComparer.Ordinal).Count() >= 2);

        foreach (var group in groups)
        {
            var byClass = group
                .GroupBy(o => o.ClassName, StringComparer.Ordinal)
                .Select(g => g.OrderByDescending(o => o.IsAddedLine).ThenByDescending(o => o.LineNumber).First())
                .ToList();

            var n = byClass.Count;
            for (var a = 0; a < n; a++)
            {
                for (var b = a + 1; b < n; b++)
                {
                    var left = byClass[a];
                    var right = byClass[b];
                    if (left.IsNegated == right.IsNegated)
                        continue;

                    var preferred = left.IsAddedLine ? left : right.IsAddedLine ? right : left;
                    var reference = ReferenceEquals(preferred, left) ? right : left;
                    mismatches.Add((preferred, reference));
                }
            }
        }

        return mismatches;
    }

    private static List<string> CollectConditionSources(string line)
    {
        var sources = new List<string>();
        var conditionalMatch = ConditionalRegex.Match(line);
        if (conditionalMatch.Success)
            sources.Add(conditionalMatch.Groups[1].Value!.Trim());

        foreach (Match ternary in TernaryConditionRegex.Matches(line))
        {
            var candidate = ternary.Groups[1].Value!.Trim();
            if (candidate.Length == 0 || candidate.Contains('{') || candidate.Contains('='))
                continue;

            sources.Add(candidate);
        }

        return sources;
    }

    private static IEnumerable<(string Condition, string Callee, bool IsNegated)> ExtractConditions(string condition)
    {
        var seen = new HashSet<string>(StringComparer.Ordinal);

        foreach (Match pattern in Regex.Matches(condition, @"(\w+)\s*:\s*(true|false)\b", RegexOptions.IgnoreCase))
        {
            var member = pattern.Groups[1].Value!;
            if (!IsBooleanMember(member) || !seen.Add(member))
                continue;

            var expectsTrue = pattern.Groups[2].Value!.Equals("true", StringComparison.OrdinalIgnoreCase);
            yield return (condition, member, !expectsTrue);
        }

        foreach (Match call in Regex.Matches(condition, @"(!)?\s*([A-Za-z_][A-Za-z0-9_]*)\s*\("))
        {
            var callee = call.Groups[2].Value!;
            if (!IsBooleanMember(callee) || !seen.Add(callee))
                continue;

            var negated = call.Groups[1].Success
                || Regex.IsMatch(condition, $@"{callee}\s*\([^)]*\)\s*==\s*false", RegexOptions.CultureInvariant);

            yield return (condition, callee, negated);
        }

        foreach (Match prop in Regex.Matches(condition, @"\.(?<member>(?:Is|Has|Can|Should)[A-Z]\w+)\b"))
        {
            var member = prop.Groups["member"].Value!;
            if (!seen.Add(member))
                continue;

            var negated = Regex.IsMatch(condition, $@"(?<![:\w])!{member}\b|{member}\s*==\s*false", RegexOptions.CultureInvariant);
            yield return (condition, member, negated);
        }

        foreach (Match bare in Regex.Matches(condition, @"\b(?<member>(?:Is|Has|Can|Should)[A-Z]\w+)\b"))
        {
            var member = bare.Groups["member"].Value!;
            if (!seen.Add(member))
                continue;

            var negated = Regex.IsMatch(condition, $@"(?<![:\w])!{member}\b|{member}\s*==\s*false", RegexOptions.CultureInvariant);
            yield return (condition, member, negated);
        }
    }

    private static bool IsBooleanMember(string name) =>
        name.StartsWith("Is", StringComparison.Ordinal) ||
        name.StartsWith("Has", StringComparison.Ordinal) ||
        name.StartsWith("Can", StringComparison.Ordinal) ||
        name.StartsWith("Should", StringComparison.Ordinal) ||
        name.EndsWith("Connected", StringComparison.Ordinal) ||
        name.EndsWith("Enabled", StringComparison.Ordinal);
}
