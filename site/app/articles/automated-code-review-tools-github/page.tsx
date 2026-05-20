import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "../_components/article-layout";
import { SourcesSection } from "../_components/sources-section";

const slug = "automated-code-review-tools-github";
const title = "Automated Code Review Tools for GitHub Pull Requests";
const description =
  "How GitHub teams should choose automated code review tools for PR comments, required checks, Actions workflows, and deterministic merge protection.";
const readingTime = "8 min read";
const ruleIds = ["GCI0001", "GCI0003", "GCI0016", "GCI0046"];
const sources = [
  {
    label: "GitHub Actions overview",
    href: "https://docs.github.com/en/actions/about-github-actions/understanding-github-actions",
    description:
      "Describes GitHub Actions workflows, events, jobs, and pull-request-triggered automation.",
  },
  {
    label: "GitHub protected branches",
    href: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
    description:
      "Documents branch protection rules, required pull request reviews, and required status checks.",
  },
  {
    label: "GitHub code scanning",
    href: "https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning",
    description:
      "Documents code scanning alerts for security vulnerabilities and coding errors, including CodeQL and third-party tools.",
  },
  {
    label: "GauntletCI integrations",
    href: "/docs/integrations",
    description:
      "Internal documentation for connecting GauntletCI to supported developer workflows.",
  },
];

export const metadata: Metadata = {
  title: `${title} | GauntletCI`,
  description,
  alternates: { canonical: `/articles/${slug}` },
  keywords: [
    "automated code review tools",
    "GitHub pull request review tools",
    "GitHub automated code review",
    "GitHub Actions code review",
    "pull request automation",
    "GitHub required checks",
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

export default function AutomatedCodeReviewToolsGitHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleLayout
        category="GitHub"
        title={title}
        intro="GitHub teams do not need another bot that comments on everything. They need automated review that fits pull request workflows, produces actionable evidence, and works as a required check when risk is real."
        dateTime="2026-05-20"
        dateLabel="May 20, 2026"
        readingTime={readingTime}
        ruleIds={ruleIds}
        related={
          <section className="space-y-4 rounded-xl border border-border bg-card/50 p-6">
            <h3 className="font-semibold text-foreground">Related reading</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/articles/best-code-review-tools-github" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Best code review tools for GitHub
              </Link>
              <Link href="/articles/best-ai-code-review-tools" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Best AI code review tools
              </Link>
              <Link href="/articles/ci-quality-gate-for-pull-requests" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                CI quality gate for pull requests
              </Link>
              <Link href="/docs/integrations" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                GauntletCI integrations
              </Link>
            </div>
          </section>
        }
      >
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">GitHub automation has two audiences</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Automated code review tools for GitHub typically interact with two different workflows: developers reading pull request feedback and branch protection deciding whether required checks have passed. A tool can be excellent for one and weak for the other.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Developer-facing automation should be helpful, concise, and educational. Merge-facing automation must be deterministic, auditable, and tied to the exact diff. Confusing those jobs is how teams end up with noisy bots or unsafe gates.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-bold">What to require from a GitHub review tool</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-card/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Capability</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium text-foreground">Diff awareness</td>
                  <td className="px-4 py-3 text-muted-foreground">The tool should focus on what changed, not re-review the entire repository every time.</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium text-foreground">Required check support</td>
                  <td className="px-4 py-3 text-muted-foreground">High-risk findings should participate in branch protection without blocking on opinions.</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium text-foreground">Rule configuration</td>
                  <td className="px-4 py-3 text-muted-foreground">Teams need to tune severity by repository, path, and risk tolerance.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Actionable output</td>
                  <td className="px-4 py-3 text-muted-foreground">Every finding should point to a concrete change and a clear next action.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Comments are not checks</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comment asks a human to notice, interpret, and prioritize. A check changes the workflow. For low-confidence suggestions, comments are appropriate. For known risk patterns like removed guard clauses, changed public contracts, or unsafe async transitions, required checks are the safer default.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GauntletCI is built for the check side of the workflow. It reports deterministic change-risk findings that can be reviewed, tuned, and enforced without turning every style preference into merge friction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">The ideal GitHub stack</h2>
          <ul className="list-disc space-y-2 pl-6 text-lg text-muted-foreground">
            <li>Use GitHub branch protection to require build, test, and security checks.</li>
            <li>Use AI review for summaries and reviewer assistance.</li>
            <li>Use deterministic PR risk analysis for behavioral and contract changes.</li>
            <li>Use human reviewers for intent, product tradeoffs, and architectural judgment.</li>
          </ul>
          <p className="text-lg text-muted-foreground leading-relaxed">
            That stack lets automation do what automation is good at while keeping humans responsible for the decisions only humans can make.
          </p>
        </section>

        <SourcesSection sources={sources} />
      </ArticleLayout>
    </>
  );
}
