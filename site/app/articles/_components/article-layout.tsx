import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RulesApplied } from "@/components/rules-applied";
import { AuthorBio } from "@/components/author-bio";

type ArticleLayoutProps = {
  category: string;
  title: string;
  intro: string;
  dateTime: string;
  dateLabel: string;
  readingTime: string;
  ruleIds: string[];
  children: ReactNode;
  related?: ReactNode;
};

export function ArticleLayout({
  category,
  title,
  intro,
  dateTime,
  dateLabel,
  readingTime,
  ruleIds,
  children,
  related,
}: ArticleLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
          <Breadcrumbs />

          <div className="space-y-5 border-b border-border pb-12">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                {category}
              </p>
              <Link
                href="/articles"
                className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
              >
                ← All articles
              </Link>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              {intro}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-sm font-medium text-foreground">Eric Cogen</span>
              <span className="text-muted-foreground/40 text-sm">·</span>
              <span className="text-sm text-muted-foreground">Founder, GauntletCI</span>
              <span className="text-muted-foreground/40 text-sm">·</span>
              <time className="text-sm text-muted-foreground" dateTime={dateTime}>
                {dateLabel}
              </time>
              <span className="text-muted-foreground/40 text-sm">·</span>
              <span className="text-sm text-muted-foreground">{readingTime}</span>
            </div>
          </div>

          <article className="space-y-16">{children}</article>

          {related}

          <RulesApplied ids={ruleIds} />

          <div className="border-t border-border pt-12">
            <AuthorBio variant="long" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
