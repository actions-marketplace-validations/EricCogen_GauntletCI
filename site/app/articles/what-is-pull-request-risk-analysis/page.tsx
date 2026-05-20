import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/article-layout";
import { SourcesSection } from "../_components/sources-section";

const slug = "what-is-pull-request-risk-analysis";
const title = "What Is Pull Request Risk Analysis?";
const description =
  "Pull request risk analysis evaluates how a diff changes behavior, contracts, tests, runtime safety, and production blast radius before merge.";
const readingTime = "7 min read";
const ruleIds = ["GCI0001", "GCI0003", "GCI0004", "GCI0032"];
const sources = [
  {
    label: "GitHub pull requests",
    href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
    description:
      "GitHub documentation explaining pull requests as a way to propose, discuss, and review changes before merge.",
  },
  {
    label: "GitHub protected branches",
    href: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
    description:
      "Documents merge requirements such as required reviews and status checks.",
  },
  {
    label: "What is diff-based analysis?",
    href: "/articles/what-is-diff-based-analysis",
    description:
      "Internal article defining GauntletCI's diff-focused analysis model.",
  },
  {
    label: "Behavioral Change Risk framework",
    href: "/articles/behavioral-change-risk-formal-framework",
    description:
      "Internal framework article defining GauntletCI's behavioral risk taxonomy.",
  },
];

export const metadata: Metadata = {
  title: `${title} | GauntletCI`,
  description,
  alternates: { canonical: `/articles/${slug}` },
  keywords: [
    "pull request risk analysis",
    "PR risk analysis",
    "code change risk",
    "diff risk analysis",
    "pull request quality gate",
    "behavioral change risk",
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

export default function PullRequestRiskAnalysisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleLayout
        category="Methodology"
        title={title}
        intro="Pull request risk analysis is the practice of evaluating the risk introduced by a specific diff, not the general quality of the repository."
        dateTime="2026-05-20"
        dateLabel="May 20, 2026"
        readingTime={readingTime}
        ruleIds={ruleIds}
        related={
          <section className="space-y-4 rounded-xl border border-border bg-card/50 p-6">
            <h3 className="font-semibold text-foreground">Related reading</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/articles/what-is-diff-based-analysis" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                What is diff-based analysis?
              </Link>
              <Link href="/articles/behavioral-change-risk-formal-framework" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Behavioral Change Risk framework
              </Link>
              <Link href="/articles/ci-quality-gate-for-pull-requests" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                CI quality gate for pull requests
              </Link>
              <Link href="/articles/detect-breaking-changes-before-merge" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Detect breaking changes before merge
              </Link>
            </div>
          </section>
        }
      >
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Risk lives in the delta</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Traditional code quality tools ask, "Is this codebase healthy?" Pull request risk analysis asks a narrower and more useful question: "What did this change make more dangerous?"
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            That distinction matters because most regressions are not introduced by obviously terrible code. They are introduced by reasonable-looking changes that alter contracts, remove assumptions, change execution order, or leave tests proving the old behavior.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-bold">The five dimensions of PR risk</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Behavioral risk</h3>
              <p className="mt-2 text-sm text-muted-foreground">Did a branch, guard, exception path, or side effect change in a way callers may notice?</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Contract risk</h3>
              <p className="mt-2 text-sm text-muted-foreground">Did a public method, serialized shape, enum value, or dependency contract change?</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Validation risk</h3>
              <p className="mt-2 text-sm text-muted-foreground">Did the production behavior change without a corresponding test update in the same diff?</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Runtime risk</h3>
              <p className="mt-2 text-sm text-muted-foreground">Did the diff introduce concurrency, resource lifecycle, error handling, or performance hot-path changes?</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Reviewability risk</h3>
              <p className="mt-2 text-sm text-muted-foreground">Did the PR mix formatting churn, broad renames, or unrelated changes that hide the real behavior delta?</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Why tests and review are not enough</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tests verify expectations that already exist. Code review depends on human attention and domain context. Pull request risk analysis sits between them. It mechanically identifies the parts of a diff that deserve deeper human judgment.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A risk finding is not a claim that the PR is wrong. It is a claim that the PR changed something with production consequences. That is the exact information reviewers need before clicking approve.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">The outcome: better merge decisions</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Good pull request risk analysis does not drown teams in commentary. It ranks the changes that matter, ties them to rules, and makes the validation gap visible. The result is not more code review theater. It is a sharper review focused on the diff's real blast radius.
          </p>
        </section>

        <SourcesSection sources={sources} />
      </ArticleLayout>
    </>
  );
}
