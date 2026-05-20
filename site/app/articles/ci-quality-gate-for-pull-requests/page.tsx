import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/article-layout";
import { SourcesSection } from "../_components/sources-section";

const slug = "ci-quality-gate-for-pull-requests";
const title = "CI Quality Gate for Pull Requests";
const description =
  "A practical framework for designing CI quality gates that block risky pull requests instead of only enforcing style, coverage, and known vulnerabilities.";
const readingTime = "7 min read";
const ruleIds = ["GCI0003", "GCI0004", "GCI0007", "GCI0041"];
const sources = [
  {
    label: "GitHub protected branches",
    href: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
    description:
      "Documents branch protection rules, required pull request reviews, and required status checks before merging.",
  },
  {
    label: "GitHub Actions overview",
    href: "https://docs.github.com/en/actions/about-github-actions/understanding-github-actions",
    description:
      "Describes GitHub Actions as a CI/CD platform for automating build, test, and deployment workflows.",
  },
  {
    label: "SonarQube quality gates",
    href: "https://docs.sonarsource.com/sonarqube-server/latest/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates/",
    description:
      "Documents quality gates as sets of conditions that pass or fail analysis and can be used with pull request decoration and CI pipelines.",
  },
  {
    label: "Why tests miss bugs",
    href: "/articles/why-tests-miss-bugs",
    description:
      "Internal article explaining GauntletCI's position on test coverage and validation gaps.",
  },
];

export const metadata: Metadata = {
  title: `${title} | GauntletCI`,
  description,
  alternates: { canonical: `/articles/${slug}` },
  keywords: [
    "CI quality gate",
    "pull request quality gate",
    "GitHub required checks",
    "merge protection",
    "code quality gate",
    "pull request risk gate",
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

export default function CIQualityGateForPullRequestsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleLayout
        category="CI/CD"
        title={title}
        intro="A pull request quality gate should do more than enforce coverage and lint rules. It should stop the specific kinds of changes that break production after everyone thought the PR was safe."
        dateTime="2026-05-20"
        dateLabel="May 20, 2026"
        readingTime={readingTime}
        ruleIds={ruleIds}
        related={
          <section className="space-y-4 rounded-xl border border-border bg-card/50 p-6">
            <h3 className="font-semibold text-foreground">Related reading</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/articles/what-is-pull-request-risk-analysis" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                What is pull request risk analysis?
              </Link>
              <Link href="/articles/sonarqube-alternative-behavioral-gating" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Beyond SonarQube behavioral gating
              </Link>
              <Link href="/articles/why-tests-miss-bugs" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Why tests miss bugs
              </Link>
              <Link href="/articles/detect-breaking-changes-before-merge" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Detect breaking changes before merge
              </Link>
            </div>
          </section>
        }
      >
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Most quality gates measure the wrong thing</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GitHub Actions can automate build and test workflows, GitHub branch protection can require status checks, and SonarQube quality gates can pass or fail analysis based on configured conditions. Those signals matter. They are not enough, by themselves, to decide whether a pull request changed behavior safely.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The dangerous changes are often clean, covered, and approved. A guard disappears. A public API changes shape. An exception path becomes silent. A test keeps passing because it never asserted the behavior that changed.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-bold">What a modern PR quality gate should block</h2>
          <div className="grid gap-4">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5">
              <h3 className="font-semibold text-red-300">Unvalidated behavioral changes</h3>
              <p className="mt-2 text-sm text-muted-foreground">Production logic changed, but tests did not. The gate should force the author to prove the new behavior is intentional.</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5">
              <h3 className="font-semibold text-red-300">Breaking contract changes</h3>
              <p className="mt-2 text-sm text-muted-foreground">Public signatures, enum members, serialization attributes, and API shapes are consumer contracts. A gate should treat them as high-risk.</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5">
              <h3 className="font-semibold text-red-300">Silent failure paths</h3>
              <p className="mt-2 text-sm text-muted-foreground">Swallowed exceptions and weakened logging turn incidents into mysteries. CI should not let observability regressions pass unnoticed.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">The gate should be deterministic</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Required checks need repeatability. If a quality gate fails, developers need to know what rule failed, what code triggered it, and what changed. If the same commit passes or fails based on a different review interpretation, the team stops trusting the gate.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            That is why pull request risk belongs in deterministic CI. AI can explain the finding, but the finding itself should come from the diff, the rule configuration, and the repository context.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">A practical gate design</h2>
          <ol className="list-decimal space-y-2 pl-6 text-lg text-muted-foreground">
            <li>Run normal build, test, lint, and security checks.</li>
            <li>Analyze only the changed files and affected symbols.</li>
            <li>Block high-risk behavioral and contract changes by default.</li>
            <li>Require explicit justification or tests when risk is intentional.</li>
            <li>Keep every finding tied to a rule so developers can tune noise.</li>
          </ol>
          <p className="text-lg text-muted-foreground leading-relaxed">
            That is the difference between a quality gate that checks boxes and a quality gate that protects production.
          </p>
        </section>

        <SourcesSection sources={sources} />
      </ArticleLayout>
    </>
  );
}
