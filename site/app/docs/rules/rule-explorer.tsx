"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories, rules, rulesByCategory, type CategorySlug, type Rule } from "@/lib/rules";

const severityOptions: Array<Rule["severity"] | "All"> = ["All", "Block", "Warn", "Info"];
const categoryOptions: Array<CategorySlug | "all"> = [
  "all",
  ...categories.map((category) => category.slug),
];

function SeverityBadge({ severity }: { severity: Rule["severity"] }) {
  const styles = {
    Block: "bg-red-500/10 text-red-400 ring-red-400/20",
    Warn: "bg-yellow-500/10 text-yellow-400 ring-yellow-400/20",
    Info: "bg-muted text-muted-foreground ring-border",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function categoryFor(slug: CategorySlug) {
  const category = categories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Unknown category slug: ${slug}`);
  return category;
}

export function RuleExplorer() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<Rule["severity"] | "All">("All");
  const [category, setCategory] = useState<CategorySlug | "all">("all");

  const filteredRules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rules.filter((rule) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          rule.id,
          rule.name,
          rule.description,
          rule.whyExists,
          categoryFor(rule.categorySlug).title,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesSeverity = severity === "All" || rule.severity === severity;
      const matchesCategory = category === "all" || rule.categorySlug === category;

      return matchesQuery && matchesSeverity && matchesCategory;
    });
  }, [category, query, severity]);

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6 space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="rule-search" className="text-sm font-medium text-foreground">
              Search rules
            </label>
            <input
              id="rule-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by rule ID, category, behavior, security, async..."
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan-500"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredRules.length}</span> of{" "}
            <span className="font-semibold text-foreground">{rules.length}</span> rules
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Severity
            </p>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSeverity(option)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    severity === option
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const categoryMeta = option === "all" ? null : categoryFor(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      category === option
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {categoryMeta && (
                      <categoryMeta.icon className={`h-3 w-3 ${categoryMeta.color}`} />
                    )}
                    {categoryMeta ? categoryMeta.title : "All categories"}
                    <span className="text-muted-foreground/60">
                      ({option === "all" ? rules.length : rulesByCategory(option).length})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {filteredRules.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium text-foreground">No rules match those filters.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader search term or clear one of the filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredRules.map((rule) => {
            const cat = categoryFor(rule.categorySlug);
            return (
              <Link
                key={rule.id}
                href={`/docs/rules/${rule.id}`}
                id={rule.id}
                className="block rounded-xl border border-border bg-card p-4 hover:border-cyan-500/40 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-semibold ring-1 ring-inset ${cat.badgeColor}`}
                    >
                      {rule.id}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      <cat.icon className={`h-3 w-3 ${cat.color}`} />
                      {cat.title}
                    </span>
                  </div>
                  <SeverityBadge severity={rule.severity} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {rule.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rule.description}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
