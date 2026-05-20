export type Article = {
  slug: string;
  href: string;
  title: string;
  description: string;
  ruleIds: string[];
};

export const articles: Article[] = [
  {
    slug: "why-tests-miss-bugs",
    href: "/articles/why-tests-miss-bugs",
    title: "Why Tests Miss Bugs",
    description:
      "Tests pass but bugs still reach production. The categories of risk that escape test suites and why a green build is not the same as safe code.",
    ruleIds: ["GCI0003", "GCI0006", "GCI0032", "GCI0041"],
  },
  {
    slug: "why-code-review-misses-bugs",
    href: "/articles/why-code-review-misses-bugs",
    title: "Why Code Review Misses Bugs",
    description:
      "Code review catches style and obvious logic errors. It routinely misses behavioral drift, contract changes, and implicit assumptions.",
    ruleIds: ["GCI0001", "GCI0003", "GCI0036", "GCI0046"],
  },
  {
    slug: "detect-breaking-changes-before-merge",
    href: "/articles/detect-breaking-changes-before-merge",
    title: "Detect Breaking Changes Before Merge",
    description:
      "How to catch removed public APIs, signature changes, and serialization breaks at commit time instead of in downstream consumers.",
    ruleIds: ["GCI0004", "GCI0021", "GCI0047", "GCI0052"],
  },
  {
    slug: "behavioral-change-risk-formal-framework",
    href: "/articles/behavioral-change-risk-formal-framework",
    title: "A Formal Framework for Behavioral Change Risk",
    description:
      "A structured taxonomy for behavioral, contract, concurrency, and side-effect risk in code diffs.",
    ruleIds: ["GCI0003", "GCI0036", "GCI0016", "GCI0007"],
  },
  {
    slug: "what-is-diff-based-analysis",
    href: "/articles/what-is-diff-based-analysis",
    title: "What Is Diff-Based Analysis?",
    description:
      "Diff-based analysis evaluates only what changed in a commit. Why that scope is the right unit of risk for pre-commit checks.",
    ruleIds: ["GCI0001", "GCI0003", "GCI0004"],
  },
  {
    slug: "can-ai-code-review-be-deterministic",
    href: "/articles/can-ai-code-review-be-deterministic",
    title: "Can AI Code Review Tools Ever Be Deterministic?",
    description:
      "Exploring the difference between helpful AI review and trustworthy engineering controls. Why determinism matters more than you think.",
    ruleIds: ["GCI0016", "GCI0012", "GCI0044"],
  },
  {
    slug: "jellyfin-pr-16062-post-mortem",
    href: "/articles/jellyfin-pr-16062-post-mortem",
    title: "A \"Performance Improvement\" PR Introduced 11 Block-Level Risks",
    description:
      "Jellyfin PR #16062 escaped code review despite introducing 11 block-level risks. Discover why traditional tools miss behavioral regressions.",
    ruleIds: ["GCI0016", "GCI0012", "GCI0044"],
  },
  {
    slug: "azure-sdk-pr-57223-risk-analysis",
    href: "/articles/azure-sdk-pr-57223-risk-analysis",
    title: "How Azure SDK PR #57223 Introduced 6,650+ Unique Risk Signals",
    description:
      "Azure SDK PR #57223 generated 6,650+ unique behavioral risk signals across 3 framework versions. See why traditional tools missed them.",
    ruleIds: ["GCI0004", "GCI0003", "GCI0006", "GCI0024", "GCI0047"],
  },
  {
    slug: "log4net-pr-201-analysis",
    href: "/articles/log4net-pr-201-analysis",
    title: "log4net PR #201: 3,753+ Risk Signals in a Major Enterprise Refactor",
    description:
      "Large-scale logging framework refactoring introducing thousands of behavioral changes across multiple code paths.",
    ruleIds: ["GCI0003", "GCI0004", "GCI0016"],
  },
  {
    slug: "google-api-pr-3150-analysis",
    href: "/articles/google-api-pr-3150-analysis",
    title: "Google API PR #3150 Analysis",
    description:
      "Behavioral risk analysis of a major Google API library pull request.",
    ruleIds: ["GCI0003", "GCI0004", "GCI0006"],
  },
  {
    slug: "stackexchange-redis-pr-3028",
    href: "/articles/stackexchange-redis-pr-3028",
    title: "StackExchange.Redis PR #3028 Analysis",
    description:
      "Behavioral change risk in a critical infrastructure library pull request.",
    ruleIds: ["GCI0003", "GCI0004", "GCI0016"],
  },
  {
    slug: "grpc-dotnet-pr-2531",
    href: "/articles/grpc-dotnet-pr-2531",
    title: "gRPC .NET PR #2531 Analysis",
    description:
      "Behavioral risk signals in a fundamental RPC framework pull request.",
    ruleIds: ["GCI0003", "GCI0004", "GCI0006"],
  },
  {
    slug: "anglesharp-pr-1159-analysis",
    href: "/articles/anglesharp-pr-1159-analysis",
    title: "AngleSharp PR #1159 Analysis",
    description:
      "HTML parser library pull request introducing behavioral changes.",
    ruleIds: ["GCI0003", "GCI0004", "GCI0006"],
  },
  {
    slug: "corpus-report-2025",
    href: "/articles/corpus-report-2025",
    title: "GauntletCI Corpus Report 2025: 40K+ Risk Signals Across 610 Enterprise PRs",
    description:
      "Comprehensive analysis of behavioral risk patterns across enterprise code changes.",
    ruleIds: ["GCI0003", "GCI0004", "GCI0016"],
  },
];

export function articlesForRule(ruleId: string): Article[] {
  return articles.filter((a) =>
    a.ruleIds.some((id) => id.toLowerCase() === ruleId.toLowerCase())
  );
}

export type CaseStudy = {
  slug: string;
  href: string;
  repo: string;
  pr: string;
  title: string;
  description: string;
  ruleIds: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "stackexchange-redis-swallowed-exception",
    href: "/articles/case-studies/stackexchange-redis-swallowed-exception",
    repo: "StackExchange/StackExchange.Redis",
    pr: "PR#2995",
    title: "Swallowed Exception in StackExchange.Redis",
    description:
      "A bare catch {} block silently drops all exceptions in the message dispatch loop.",
    ruleIds: ["GCI0007"],
  },
  {
    slug: "newtonsoft-json-assignment-in-getter",
    href: "/articles/case-studies/newtonsoft-json-assignment-in-getter",
    repo: "JamesNK/Newtonsoft.Json",
    pr: "PR#1950",
    title: "Assignment in Getter - Newtonsoft.Json",
    description:
      "Mutation inside a property getter breaks the side-effect-free contract.",
    ruleIds: ["GCI0036", "GCI0004"],
  },
  {
    slug: "efcore-breaking-api-removal",
    href: "/articles/case-studies/efcore-breaking-api-removal",
    repo: "dotnet/efcore",
    pr: "PR#38024",
    title: "Breaking API Removal in EF Core",
    description:
      "Public API removed without Obsolete - breaks all EF Core provider authors.",
    ruleIds: ["GCI0004", "GCI0003"],
  },
  {
    slug: "nunit-thread-sleep-async",
    href: "/articles/case-studies/nunit-thread-sleep-async",
    repo: "nunit/nunit",
    pr: "PR#5192",
    title: "Thread.Sleep in Async Context - NUnit",
    description:
      "Thread.Sleep in async context in the NUnit test framework source itself.",
    ruleIds: ["GCI0016"],
  },
  {
    slug: "azuread-hardcoded-authority",
    href: "/articles/case-studies/azuread-hardcoded-authority",
    repo: "AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet",
    pr: "PR#3410",
    title: "Hardcoded Authority URL - Azure AD",
    description: "Hardcoded authority URL in production identity model code.",
    ruleIds: ["GCI0010", "GCI0003"],
  },
];

export function caseStudiesForRule(ruleId: string): CaseStudy[] {
  return caseStudies.filter((cs) =>
    cs.ruleIds.some((id) => id.toLowerCase() === ruleId.toLowerCase())
  );
}
