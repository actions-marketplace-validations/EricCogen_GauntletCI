/**
 * Builds GitHub PR comment markdown from GauntletCI JSON findings.
 * Mirrors GauntletCI.Cli.Output.GitHubPrReviewWriter formatting.
 */

export interface NormalizedFinding {
  ruleId: string;
  ruleName: string;
  summary: string;
  evidence: string;
  whyItMatters: string;
  suggestedAction: string;
  confidence: string;
  severity: string;
  filePath?: string;
  line?: number;
}

export interface GroupedFinding {
  ruleId: string;
  ruleName: string;
  summary: string;
  whyItMatters: string;
  suggestedAction: string;
  confidence: string;
  severity: string;
  filePath?: string;
  primaryLine?: number;
  lines: number[];
  evidence: string[];
  count: number;
}

export interface RawFinding {
  RuleId?: string;
  ruleId?: string;
  Rule?: string;
  RuleName?: string;
  ruleName?: string;
  Title?: string;
  title?: string;
  Message?: string;
  message?: string;
  Summary?: string;
  summary?: string;
  Evidence?: string;
  evidence?: string;
  WhyItMatters?: string;
  whyItMatters?: string;
  SuggestedAction?: string;
  suggestedAction?: string;
  Confidence?: number | string;
  confidence?: number | string;
  Severity?: number | string;
  severity?: number | string;
  FilePath?: string;
  filePath?: string;
  Path?: string;
  path?: string;
  Line?: number;
  line?: number;
}

export function normalizeFinding(finding: RawFinding): NormalizedFinding {
  return {
    ruleId: finding.RuleId ?? finding.ruleId ?? finding.Rule ?? "GCI",
    ruleName: finding.RuleName ?? finding.ruleName ?? finding.Title ?? finding.title ?? "Finding",
    summary: finding.Summary ?? finding.summary ?? finding.Message ?? finding.message ?? "Finding",
    evidence: finding.Evidence ?? finding.evidence ?? "",
    whyItMatters: finding.WhyItMatters ?? finding.whyItMatters ?? "",
    suggestedAction: finding.SuggestedAction ?? finding.suggestedAction ?? "",
    confidence: formatConfidence(finding.Confidence ?? finding.confidence),
    severity: String(finding.Severity ?? finding.severity ?? ""),
    filePath: finding.FilePath ?? finding.filePath ?? finding.Path ?? finding.path,
    line: finding.Line ?? finding.line,
  };
}

export function groupFindings(findings: NormalizedFinding[]): GroupedFinding[] {
  const entries = new Map<string, { order: number; first: NormalizedFinding; all: NormalizedFinding[] }>();
  let order = 0;

  for (const finding of findings) {
    const key = `${finding.ruleId}|${finding.filePath ?? ""}`;
    const existing = entries.get(key);
    if (!existing) {
      entries.set(key, { order: order++, first: finding, all: [finding] });
    } else {
      existing.all.push(finding);
    }
  }

  return [...entries.values()]
    .sort((a, b) => a.order - b.order)
    .map(({ first, all }) => {
      const lines = [...new Set(all.map((f) => f.line).filter((line): line is number => line !== undefined))]
        .sort((a, b) => a - b);
      const evidence = [...new Set(all.map((f) => f.evidence).filter((value) => value.trim().length > 0))];

      return {
        ruleId: first.ruleId,
        ruleName: first.ruleName,
        summary: first.summary,
        whyItMatters: first.whyItMatters,
        suggestedAction: first.suggestedAction,
        confidence: first.confidence,
        severity: first.severity,
        filePath: first.filePath,
        primaryLine: lines.length > 0 ? lines[0] : first.line,
        lines,
        evidence,
        count: all.length,
      };
    });
}

export function formatEvidenceMarkdown(evidence: string): string {
  if (!evidence.trim()) return "";

  const wasNow = /^Was:\s*(.+?)\s*\|\s*Now:\s*(.+)$/s.exec(evidence);
  if (wasNow) {
    return `\`\`\`diff\n- ${wasNow[1].trim()}\n+ ${wasNow[2].trim()}\n\`\`\``;
  }

  const removedLogic = /^Removed logic:\s*(.+)$/s.exec(evidence);
  if (removedLogic) {
    const items = removedLogic[1].split(" | ").map((item) => item.trim()).filter(Boolean);
    const lines = items.map((item) => `- ${item}`).join("\n");
    return `\`\`\`diff\n${lines}\n\`\`\``;
  }

  const removed = /^Removed:\s*(.+)$/s.exec(evidence);
  if (removed) {
    return `\`\`\`diff\n- ${removed[1].trim()}\n\`\`\``;
  }

  return `> ${evidence}`;
}

export function buildCommentBody(group: GroupedFinding): string {
  const lines: string[] = [];
  const lineLabel = group.lines.length > 1 ? `: lines ${group.lines.join(", ")}` : "";
  lines.push(`**${group.ruleId}: ${group.ruleName}**${lineLabel}`);
  lines.push("");
  lines.push(group.summary);

  if (group.evidence.length > 0) {
    lines.push("");
    if (group.evidence.length === 1) {
      lines.push(formatEvidenceMarkdown(group.evidence[0]));
    } else {
      lines.push("**Evidence:**");
      for (const ev of group.evidence) {
        lines.push(formatEvidenceMarkdown(ev));
      }
    }
  }

  if (group.whyItMatters.trim()) {
    lines.push("");
    lines.push(`⚠️ **Why it matters:** ${group.whyItMatters}`);
  }

  if (group.suggestedAction.trim()) {
    lines.push("");
    lines.push(`💡 **Suggested action:** ${group.suggestedAction}`);
  }

  lines.push("");
  lines.push(`<sub>Confidence: ${group.confidence} | Severity: ${group.severity}${group.count > 1 ? ` | ${group.count} occurrences` : ""}</sub>`);

  return lines.join("\n");
}

export function buildReviewComment(
  input: { repositoryFullName: string; pullNumber: number; headSha: string; trigger: string },
  findings: RawFinding[],
  exitCode: number,
  sensitivity: string,
  severity: string,
  postedInlineReview: boolean
): string {
  const normalized = findings.map(normalizeFinding);
  const groups = groupFindings(normalized);
  const lines: string[] = [
    "## GauntletCI Review",
    "",
    `GauntletCI completed for \`${input.repositoryFullName}#${input.pullNumber}\`.`,
    "",
    `- Trigger: \`${input.trigger}\``,
    `- Commit: \`${input.headSha}\``,
    `- Findings: \`${findings.length}\``,
    `- Tool exit code: \`${exitCode}\``,
    `- Sensitivity: \`${sensitivity}\``,
    `- Severity threshold: \`${severity}\``,
  ];

  if (findings.length === 0) {
    lines.push("", "No findings were reported.");
    return lines.join("\n");
  }

  lines.push("");
  if (postedInlineReview) {
    lines.push(
      "Findings with valid diff locations are also posted as **inline review comments** on the changed files.",
      ""
    );
  }
  lines.push(
    "Expand each entry for evidence, rationale, and suggested action (same detail as the HTML/SARIF artifacts).",
    ""
  );

  for (const group of groups) {
    const location = formatLocation(group);
    lines.push("<details>");
    lines.push(`<summary><strong>${group.ruleId}: ${group.ruleName}</strong>${location}: ${escapeInline(group.summary)}</summary>`);
    lines.push("");
    lines.push(buildCommentBody(group));
    lines.push("");
    lines.push("</details>");
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function formatLocation(group: GroupedFinding): string {
  if (!group.filePath) return "";
  if (group.lines.length > 1) return ` (\`${group.filePath}\` lines ${group.lines.join(", ")})`;
  if (group.primaryLine !== undefined) return ` (\`${group.filePath}:${group.primaryLine}\`)`;
  return ` (\`${group.filePath}\`)`;
}

function formatConfidence(value: number | string | undefined): string {
  if (value === undefined || value === "") return "";
  if (typeof value === "string") return value;
  if (value <= 0.4) return "Low";
  if (value <= 0.7) return "Medium";
  return "High";
}

function escapeInline(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}
