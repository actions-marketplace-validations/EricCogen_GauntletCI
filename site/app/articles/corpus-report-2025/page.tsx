import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RulesApplied } from "@/components/rules-applied";
import JsonLd from "@/components/json-ld";

export const metadata: Metadata = {
  title: "The GauntletCI Corpus Report: 148,000+ Risk Signals Across 610 C# PRs | GauntletCI",
  description:
    "Comprehensive analysis of 610 merged pull requests from 61 enterprise C# repositories. Discover patterns in code risk, behavioral changes, and the findings that static tools miss.",
  alternates: { canonical: "/articles/corpus-report-2025" },
  keywords: ["code analysis", "C#", ".NET", "static analysis", "code review", "risk patterns", "GauntletCI", "behavioral change detection"],
  authors: [{ name: "Eric Cogen", url: "https://github.com/EricCogen" }],
  creator: "Eric Cogen",
  publisher: "GauntletCI",
  openGraph: {
    title: "The GauntletCI Corpus Report: Analyzing 148,000+ Risk Signals Across 610 PRs",
    description:
      "What patterns emerge when you analyze behavioral changes across 61 enterprise repositories? Discover critical insights about .NET code quality.",
    url: "https://gauntletci.com/articles/corpus-report-2025",
    type: "article",
    images: [
      {
        url: "/og/corpus-report-2025.png",
        width: 1200,
        height: 630,
        alt: "GauntletCI Corpus Report 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GauntletCI Corpus Report: 610 PRs, 148K Risk Signals, 61 Repos",
    description: "What behavioral risks hide in enterprise .NET codebases? Analysis of 610 merged PRs reveals the patterns that code review misses.",
    images: ["/og/corpus-report-2025.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The GauntletCI Corpus Report: Analyzing 148,000+ Risk Signals Across 610 PRs",
  description:
    "Comprehensive behavioral change analysis across 610 merged pull requests from 61 enterprise C# repositories. Data-driven insights into code quality patterns.",
  image: "/og/corpus-report-2025.png",
  datePublished: "2026-05-19T00:00:00Z",
  author: {
    "@type": "Person",
    name: "Eric Cogen",
    url: "https://github.com/EricCogen",
  },
  publisher: {
    "@type": "Organization",
    name: "GauntletCI",
    url: "https://gauntletci.com",
    logo: {
      "@type": "ImageObject",
      url: "https://gauntletci.com/icon.svg",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://gauntletci.com/articles/corpus-report-2025",
  },
  keywords: [
    "code analysis",
    "C#",
    ".NET",
    "static analysis",
    "behavioral change detection",
    "code quality",
    "risk signals",
  ],
};

export default function CorpusReportPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs items={[{ label: "Articles", href: "/articles" }, { label: "Corpus Report" }]} />

      <article className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <JsonLd data={jsonLd} />

        <h1 className="text-4xl font-bold mb-4">The GauntletCI Corpus Report - Analyzing 148,000 Risk Signals Across 610 Enterprise PRs</h1>
        <p className="text-lg text-gray-600 mb-8">
          What emerges when you systematically analyze behavioral changes across 610 merged pull requests from 61 C# repositories? We analyzed the corpus to uncover patterns that traditional code review and testing miss.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-100 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">610</div>
              <div className="text-sm text-gray-600">Merged PRs</div>
            </div>
            <div className="bg-slate-100 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">61</div>
              <div className="text-sm text-gray-600">Repositories</div>
            </div>
            <div className="bg-slate-100 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">148K</div>
              <div className="text-sm text-gray-600">Risk Signals</div>
            </div>
            <div className="bg-slate-100 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">29</div>
              <div className="text-sm text-gray-600">Rule Types</div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is the Corpus?</h2>
          <p className="mb-4">
            The GauntletCI corpus represents a systematic scan of 610 real-world pull requests that were already merged and deployed. These aren't theoretical code samples or student projects - these are production changes across enterprise organizations including Microsoft, Google, Amazon, Azure, and community-driven projects like Jellyfin.
          </p>
          <p className="mb-4">
            Every PR in the corpus is written in C# and represents actual behavioral changes to mature codebases. GauntletCI analyzed each diff to detect:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Signature changes that break callers</li>
            <li>Null dereference risks</li>
            <li>Async deadlock candidates</li>
            <li>Security issues (reflection misuse, SQL injection patterns)</li>
            <li>Exception path changes</li>
            <li>Concurrency and state risks</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Risk Signal Distribution - The Top 10 Rules</h2>
          <p className="mb-4">
            Not all risk signals are created equal. Here are the patterns that appear most frequently across the corpus:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-300 p-2 text-left">Rule ID</th>
                  <th className="border border-slate-300 p-2 text-left">Description</th>
                  <th className="border border-slate-300 p-2 text-right">Occurrences</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0004</td>
                  <td className="border border-slate-300 p-2">Public API exposure (making internals public)</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">59,965</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0003</td>
                  <td className="border border-slate-300 p-2">Method signature changes (breaking contracts)</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">39,628</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0006</td>
                  <td className="border border-slate-300 p-2">Null dereference and edge case handling</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">10,978</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0015</td>
                  <td className="border border-slate-300 p-2">Exception path changes</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">10,389</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0016</td>
                  <td className="border border-slate-300 p-2">Async deadlock candidates</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">4,040</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0024</td>
                  <td className="border border-slate-300 p-2">Security - dangerous API usage</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">3,435</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0010</td>
                  <td className="border border-slate-300 p-2">Thread safety and concurrency risks</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">3,225</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0001</td>
                  <td className="border border-slate-300 p-2">Diff integrity (mixed scopes)</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">2,674</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI0036</td>
                  <td className="border border-slate-300 p-2">Performance hotpath risks</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">2,524</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-mono text-blue-600">GCI_SYN_AGG</td>
                  <td className="border border-slate-300 p-2">Synthetic aggregates (pattern rules)</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">2,231</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Key Insight: GCI0004 and GCI0003 Dominate</h2>
          <p className="mb-4">
            Together, <span className="font-mono bg-slate-100 px-1">GCI0004</span> (public API exposure) and <span className="font-mono bg-slate-100 px-1">GCI0003</span> (signature changes) account for <strong>60% of all risk signals in the corpus</strong> - a combined 99,593 findings.
          </p>
          <p className="mb-4">
            This reveals a critical pattern: most behavioral risks in .NET come from contract violations rather than crashes or exceptions. A method signature change that breaks callers won't be caught by unit tests. An internal API exposed as public won't fail during testing. These risks propagate silently through the dependency chain until they hit production.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Top 5 Risk-Bearing Projects</h2>
          <p className="mb-4">
            Not all repositories are equally risky. Here are the projects with the highest total risk signals:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-300 p-2 text-left">Repository</th>
                  <th className="border border-slate-300 p-2 text-right">PRs</th>
                  <th className="border border-slate-300 p-2 text-right">Total Findings</th>
                  <th className="border border-slate-300 p-2 text-right">Avg per PR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2"><strong>Azure/azure-sdk-for-net</strong></td>
                  <td className="border border-slate-300 p-2 text-right">18</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">42,919</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">2,384</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2"><strong>googleapis/google-api-dotnet-client</strong></td>
                  <td className="border border-slate-300 p-2 text-right">17</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">12,009</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">707</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2"><strong>dotnet/orleans</strong></td>
                  <td className="border border-slate-300 p-2 text-right">14</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">4,188</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">299</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2"><strong>dotnet/runtime</strong></td>
                  <td className="border border-slate-300 p-2 text-right">17</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">2,118</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">125</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2"><strong>dotnet/efcore</strong></td>
                  <td className="border border-slate-300 p-2 text-right">16</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">2,618</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">164</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The Azure SDK Finding: A Case Study in Scale</h2>
          <p className="mb-4">
            Azure SDK PR #57223 alone generated <strong>40,156 risk signals</strong> - nearly 27% of the entire corpus. To understand what this means, see our deep dive:
          </p>
          <p className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-600">
            <Link href="/articles/azure-sdk-pr-57223-risk-analysis" className="text-blue-600 font-semibold hover:underline">
              Read: How Azure SDK PR 57223 Introduced 40,000 Risk Signals
            </Link>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What This Means for Your Team</h2>
          <p className="mb-4">
            The corpus reveals three critical gaps in traditional code review:
          </p>
          <ol className="list-decimal list-inside space-y-4">
            <li>
              <strong>Contract violations are silent:</strong> A method signature change or visibility modifier change doesn't trigger any exception - it breaks callers downstream. Only behavioral analysis catches these.
            </li>
            <li>
              <strong>Scale hides risks:</strong> When a PR touches thousands of lines or hundreds of signatures (like Azure SDK), manual review becomes impractical. GauntletCI's systematic analysis surfaces patterns that humans miss.
            </li>
            <li>
              <strong>Tests can't catch behavioral regressions:</strong> Your existing unit tests pass. The PR is merged. Months later, a subtle behavioral change causes production failures in edge cases your tests didn't cover.
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Methodology</h2>
          <p className="mb-4">
            This corpus comprises 610 publicly available, already-merged pull requests from 61 C# repositories. Each PR was analyzed using GauntletCI 2.8.0-alpha, which scans diffs for 29 distinct rule types covering behavioral changes, security risks, concurrency issues, and API contract violations.
          </p>
          <p className="mb-4">
            No filtering was applied. Every finding reported by GauntletCI is included in this analysis. The goal is to show what behavioral risks look like in production code at scale.
          </p>
        </section>
      </article>

      <Footer />
    </main>
  );
}
