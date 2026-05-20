import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/article-layout";
import { SourcesSection } from "../_components/sources-section";

const slug = "best-code-review-tools-github";
const title = "Best Code Review Tools for GitHub";
const description =
  "A GitHub-focused guide to choosing code review tools across human review, AI assistants, security scanners, static analysis, and PR risk gates.";
const readingTime = "8 min read";
const ruleIds = ["GCI0003", "GCI0004", "GCI0012", "GCI0041"];
const sources = [
  {
    label: "GitHub pull requests",
    href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
    description:
      "Documents pull requests as GitHub's workflow for proposing, discussing, and reviewing changes.",
  },
  {
    label: "GitHub protected branches",
    href: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
    description:
      "Documents required reviews, required status checks, and other merge requirements.",
  },
  {
    label: "GitHub code scanning",
    href: "https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning",
    description:
      "Documents code scanning for security vulnerabilities and errors, including CodeQL and third-party tools.",
  },
  {
    label: "SonarQube quality gates",
    href: "https://docs.sonarsource.com/sonarqube-server/latest/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates/",
    description:
      "Documents quality gates as conditions used to pass or fail code analysis and report status to CI or repository platforms.",
  },
];

export const metadata: Metadata = {
  title: `${title} | GauntletCI`,
  description,
  alternates: { canonical: `/articles/${slug}` },
  keywords: [
    "best code review tools for GitHub",
    "GitHub code review tools",
    "pull request review tools",
    "GitHub code quality tools",
    "GitHub PR tools",
    "code review automation",
  ],
  authors: [{ name: "Eric Cogen", url: "https://github.com/EricCogen" }],
  creator: "Eric Cogen",
  publisher: "GauntletCI",
  openGraph: {
    title,
    description,
    url: `https://gauntletci.com/articles/${slug}`,
    type: "article",
    images: [{ url: `/og/${slug}.png`, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`/og/${slug}.png`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  image: `/og/${slug}.png`,
  datePublished: "2026-05-20T00:00:00Z",
  author: { "@type": "Person", name: "Eric Cogen", url: "https://github.com/EricCogen" },
  publisher: {
    "@type": "Organization",
    name: "GauntletCI",
    url: "https://gauntletci.com",
    logo: { "@type": "ImageObject", url: "https://gauntletci.com/icon.svg" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://gauntletci.com/articles/${slug}`,
  },
  keywords: metadata.keywords,
};

export default function BestCodeReviewToolsGitHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleLayout
        category="Buyer's Guide"
        title={title}
        intro="The best GitHub code review stack is not one tool. It is a layered system that separates human judgment, AI assistance, security scanning, static analysis, and deterministic PR risk gating."
        dateTime="2026-05-20"
        dateLabel="May 20, 2026"
        readingTime={readingTime}
        ruleIds={ruleIds}
        related={
          <section className="space-y-4 rounded-xl border border-border bg-card/50 p-6">
            <h3 className="font-semibold text-foreground">Related reading</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/articles/automated-code-review-tools-github" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Automated code review tools for GitHub
              </Link>
              <Link href="/articles/best-ai-code-review-tools" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Best AI code review tools
              </Link>
              <Link href="/compare/gauntletci-vs-codeql" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                GauntletCI vs CodeQL
              </Link>
              <Link href="/compare/gauntletci-vs-sonarqube" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                GauntletCI vs SonarQube
              </Link>
            </div>
          </section>
        }
      >
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">GitHub review needs layers</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GitHub provides the core workflow: pull requests, branch protection, required reviews, required status checks, and GitHub Actions automation. The question is which tools you attach to that workflow, and what each tool is allowed to decide.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A single "best" code review tool does not exist because code review has multiple jobs. Some jobs need humans. Some need AI. Some need deterministic analysis. The best stack assigns each job to the right layer.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-bold">The five-tool model</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">1. Human review</h3>
              <p className="mt-2 text-sm text-muted-foreground">Best for product intent, maintainability tradeoffs, ownership, and architecture.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">2. AI review assistance</h3>
              <p className="mt-2 text-sm text-muted-foreground">Best for summaries, possible issue discovery, documentation suggestions, and reviewer acceleration.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">3. Security scanning</h3>
              <p className="mt-2 text-sm text-muted-foreground">Best for known vulnerability classes, dependency issues, unsafe APIs, and suspicious data flows.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">4. Static analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">Best for code quality, maintainability rules, organization-wide standards, and long-term trend tracking.</p>
            </div>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-5">
              <h3 className="font-semibold text-cyan-300">5. Pull request risk analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">Best for blocking changed behavior, contract drift, missing validation, and runtime risk before merge.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">What most buyer guides miss</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Most code review tool comparisons focus on integrations, pricing, language coverage, and comment quality. Those are useful filters. They miss the most important operational question: which tool is allowed to block a merge?
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A tool that writes helpful suggestions can be probabilistic. A tool that blocks production deployment needs repeatable evidence. GitHub branch protection makes that difference explicit: required checks should be deterministic enough for developers to trust.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Where GauntletCI belongs in the stack</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GauntletCI belongs beside your existing GitHub review process as the deterministic PR risk gate. It is not a replacement for human judgment, AI assistance, CodeQL, or broad static analysis. It catches the behavioral and contract changes those layers are not designed to enforce.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            If a pull request changes production behavior, removes a public contract, introduces unsafe async patterns, or leaves a validation gap, the review should know before merge. That is the role of a code review tool built for risk, not just comments.
          </p>
        </section>

        <SourcesSection sources={sources} />
      </ArticleLayout>
    </>
  );
}
