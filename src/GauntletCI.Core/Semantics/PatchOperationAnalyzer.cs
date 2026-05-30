// SPDX-License-Identifier: Elastic-2.0
using System.Text.RegularExpressions;
using GauntletCI.Core.Diff;

namespace GauntletCI.Core.Semantics;

/// <summary>
/// Extracts low-level patch operations from a diff, focusing on conditional polarity changes (PG-SEMANTICS).
/// </summary>
public static class PatchOperationAnalyzer
{
    private static readonly Regex IfLineRegex =
        new(@"^\s*if\s*\((.+)\)", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    /// <summary>Builds patch operations from <paramref name="diff"/>.</summary>
    public static PatchOperationCollection Analyze(DiffContext diff)
    {
        ArgumentNullException.ThrowIfNull(diff);

        var operations = new PatchOperationCollection();

        foreach (var file in diff.Files)
        {
            if (IsTestFilePath(file.NewPath))
                continue;

            foreach (var hunk in file.Hunks)
            {
                AnalyzeHunk(file.NewPath, hunk, operations);
            }
        }

        return operations;
    }

    private static void AnalyzeHunk(string filePath, DiffHunk hunk, PatchOperationCollection operations)
    {
        var lines = hunk.Lines.ToList();

        for (var i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            if (line.Kind != DiffLineKind.Added)
                continue;

            var addedMatch = IfLineRegex.Match(line.Content);
            if (!addedMatch.Success)
                continue;

            var addedCondition = addedMatch.Groups[1].Value.Trim();
            var removedPartner = FindNearbyRemovedPartner(lines, i, addedCondition);
            if (removedPartner is null)
            {
                operations.Add(PatchOperationFactory.ConditionalModified(
                    $"Added conditional: {Truncate(addedCondition)}",
                    line.LineNumber,
                    filePath,
                    risk: 0.55));
                continue;
            }

            if (IsPolarityFlip(removedPartner.Condition, addedCondition))
            {
                operations.Add(PatchOperationFactory.ConditionalModified(
                    $"Polarity flip: `{Truncate(removedPartner.Condition)}` → `{Truncate(addedCondition)}`",
                    line.LineNumber,
                    filePath,
                    risk: 0.95));
            }
            else
            {
                operations.Add(PatchOperationFactory.ConditionalModified(
                    $"Conditional changed: `{Truncate(removedPartner.Condition)}` → `{Truncate(addedCondition)}`",
                    line.LineNumber,
                    filePath,
                    risk: 0.75));
            }
        }
    }

    private sealed record RemovedPartner(string Condition, int LineNumber);

    private static RemovedPartner? FindNearbyRemovedPartner(
        IReadOnlyList<DiffLine> lines,
        int addedIndex,
        string addedCondition)
    {
        var start = Math.Max(0, addedIndex - 8);
        var end = Math.Min(lines.Count, addedIndex + 4);

        for (var j = start; j < end; j++)
        {
            if (j == addedIndex)
                continue;

            var candidate = lines[j];
            if (candidate.Kind != DiffLineKind.Removed)
                continue;

            var match = IfLineRegex.Match(candidate.Content);
            if (!match.Success)
                continue;

            var removedCondition = match.Groups[1].Value.Trim();
            if (SharePredicateSymbol(removedCondition, addedCondition))
            {
                return new RemovedPartner(removedCondition, candidate.LineNumber);
            }
        }

        return null;
    }

    /// <summary>Returns true when two if-conditions appear to differ by boolean polarity only.</summary>
    public static bool IsPolarityFlip(string removedCondition, string addedCondition)
    {
        var removedNegated = IsNegatedCondition(removedCondition);
        var addedNegated = IsNegatedCondition(addedCondition);
        if (removedNegated != addedNegated)
            return true;

        var removedFalse = Regex.IsMatch(removedCondition, @":\s*false\b", RegexOptions.IgnoreCase);
        var addedTrue = Regex.IsMatch(addedCondition, @":\s*true\b", RegexOptions.IgnoreCase);
        if (removedFalse && addedTrue)
            return true;

        var removedTrue = Regex.IsMatch(removedCondition, @":\s*true\b", RegexOptions.IgnoreCase);
        var addedFalse = Regex.IsMatch(addedCondition, @":\s*false\b", RegexOptions.IgnoreCase);
        return removedTrue && addedFalse;
    }

    private static bool IsNegatedCondition(string condition)
    {
        if (condition.StartsWith('!'))
            return true;

        return Regex.IsMatch(condition, @"==\s*false\b|!=\s*true\b", RegexOptions.IgnoreCase);
    }

    private static bool SharePredicateSymbol(string left, string right)
    {
        foreach (Match match in Regex.Matches(left + " " + right, @"\b(Is[A-Z]\w+)\b"))
        {
            var symbol = match.Groups[1].Value;
            if (left.Contains(symbol, StringComparison.Ordinal) &&
                right.Contains(symbol, StringComparison.Ordinal))
            {
                return true;
            }
        }

        foreach (Match match in Regex.Matches(left + " " + right, @"\b([A-Za-z_][A-Za-z0-9_]*)\s*\("))
        {
            var callee = match.Groups[1].Value;
            if (left.Contains(callee + "(", StringComparison.Ordinal) &&
                right.Contains(callee + "(", StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }

    private static string Truncate(string text, int max = 72) =>
        text.Length <= max ? text : text[..max] + "...";

    private static bool IsTestFilePath(string path) =>
        path.Contains("Test", StringComparison.OrdinalIgnoreCase) ||
        path.Contains("Tests", StringComparison.OrdinalIgnoreCase) ||
        path.EndsWith(".Tests.csproj", StringComparison.OrdinalIgnoreCase);
}
