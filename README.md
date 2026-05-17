# GauntletCI

<div><img src="assets/images/GauntletCI.png" alt="GauntletCI Logo" width="200" align="right"/></div>

[![GauntletCI](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/EricCogen/db3979f1a5d69ce37d425b73bdcf4ada/raw/gauntletci-badge.json)](https://github.com/EricCogen/GauntletCI)
[![GitHub last commit](https://img.shields.io/github/last-commit/EricCogen/GauntletCI)](https://github.com/EricCogen/GauntletCI/commits/main)
[![GitHub stars](https://img.shields.io/github/stars/EricCogen/GauntletCI?style=social)](https://github.com/EricCogen/GauntletCI/stargazers)
[![NuGet downloads](https://img.shields.io/nuget/dt/GauntletCI?label=NuGet)](https://www.nuget.org/packages/GauntletCI)
[![License](https://img.shields.io/badge/License-Elastic_2.0-blue.svg)](LICENSE)

---

**Your tests passed. Your PR was approved. Your change still broke production.**

Tests confirm existing behavior. Code review confirms intent. **Neither validates what your change actually does.**

GauntletCI detects **Behavioral Change Risk** in pull request diffs: logic shifts, missing validations, and hidden regressions that compile cleanly, pass every test, and survive code review — before the commit is created.

---

## The Missing Layer

Modern pipelines answer different questions:

| Layer | Question answered |
|---|---|
| Static analysis | Is this code well-formed? |
| Security scanning | Does this code contain known vulnerabilities? |
| Tests | Does this code match expected behavior? |
| Code review | Does this change match intended behavior? |
| **GauntletCI** | **Is the behavioral impact of this change verified?** |

GauntletCI doesn't replace any of these. It closes the gap none of them cover.

---

## The Change That Looked Safe

```diff
 public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
 {
-    if (request is null) throw new ArgumentNullException(nameof(request));
     var order = new Order(request.CustomerId, request.Items);
     return await _repo.SaveAsync(order);
 }
```

One line removed. Tests passed. PR approved as "cleaned up redundant null check."

Callers relying on the early `ArgumentNullException` now receive a `NullReferenceException` deeper in the call stack. The change shipped.

**GauntletCI flagged it before the commit was created:**

```
[High] GCI0003: Guard clause removed at line 3. ArgumentNullException no
longer thrown on null input. Callers relying on this contract will see
NullReferenceException deeper in the call stack.
```

This is Behavioral Change Risk: a change that compiles, passes tests, and passes review — but alters runtime behavior in a way none of those checks can see.

---

## Quick Start

```bash
dotnet tool install -g GauntletCI

# Run against staged changes before committing
gauntletci analyze --staged
```

Five minutes from install to first finding. No configuration required.

**→ [Full install guide](docs/install.md) | [CLI reference](docs/cli-reference.md)**

---

## What GauntletCI Detects

35 deterministic rules across 8 production risk tiers:

| Tier | Category | Example |
|---|---|---|
| 1 | Structural & Scope Integrity | Visibility changes, signature drift |
| 2 | Behavioral & Correctness Risk | Control flow changes, removed guard clauses |
| 3 | Security & Compliance | Secrets in diffs, SQL injection exposure, PII logging |
| 4 | Resource & Concurrency | Async deadlocks, undisposed resources, shared state |
| 5 | Observability & Failure | Swallowed exceptions, removed logging from error paths |
| 6 | Evidence & Test Completeness | Behavior change with no corresponding test delta |
| 7 | Architecture & Structural Contracts | Interface violations, coupling changes |
| 8 | Dependency & Integration Safety | Version conflicts, breaking API surface changes |

Detection is fully deterministic. Same diff, same findings, every time. No LLM evaluates whether a rule fires.

**→ [Full rule catalog](docs/rules/README.md)**

---

## How It Compares

| | GauntletCI | CodeRabbit | Copilot Code Review | SonarQube |
|---|---|---|---|---|
| Deterministic findings | ✅ | ❌ | ❌ | ✅ |
| Behavioral change detection | ✅ | Partial | Partial | ❌ |
| Test coverage gap detection | ✅ | ❌ | ❌ | ❌ |
| Runs pre-commit (local) | ✅ | ❌ | ❌ | ❌ |
| 100% local / no data egress | ✅ | ❌ | ❌ | ✅ |
| .NET-native | ✅ | ❌ | ❌ | ✅ |
| AI explanations available | ✅ opt-in | ✅ | ✅ | ❌ |

LLM explanations are available as an opt-in layer. The detection logic itself never involves one.

---

## See It Live

The **[GauntletCI-Demo](https://github.com/EricCogen/GauntletCI-Demo)** repo contains 36 scenarios across 3 tiers — each compiling cleanly, passing all tests, and passing traditional SAST gates, while introducing behavioral risk only visible at the diff level.

- **Tier 1**: 6 core rule scenarios
- **Tier 2**: 12 single-rule scenarios
- **Tier 3**: 18 behavioral regression scenarios

**[→ Browse live demo PRs](https://github.com/EricCogen/GauntletCI-Demo/pulls)**

---

## GitHub Actions

Start in advisory mode. Inline comments surface findings without blocking merges:

```yaml
name: GauntletCI

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  risk-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: EricCogen/GauntletCI@main
        with:
          fail-on-findings: "false"
          inline-comments: "true"
```

Once signal quality is tuned for your codebase, set `fail-on-findings: "true"` to block risky merges.

---

## Baseline Delta Mode

Introducing GauntletCI into a codebase with existing legacy risk?

```bash
gauntletci baseline create
gauntletci analyze --staged
```

Only findings introduced since the baseline are surfaced. Legacy findings are suppressed until you address them.

---

## Real-World Patterns

GauntletCI's rules are drawn from real incident patterns. A few of the categories it covers:

**Security & Data Integrity**
- PII accidentally written to logs — silent until a compliance audit
- SQL column truncation during schema migrations — data loss with no exception thrown
- Cryptographically weak token generation — predictable outputs enable account takeover

**Reliability & Concurrency**
- `async void` event handlers swallowing exceptions at the process boundary
- Race conditions on shared state introduced by removing a lock

**API Design & Idempotency**
- Retry-unsafe endpoints missing idempotency keys — duplicate operations on transient failure

**→ [View case studies](docs/case-studies/README.md) | [Real OSS diff examples](docs/risky-diffs/README.md)**

---

## Privacy

- All analysis runs locally
- No code leaves your machine
- Auto-redaction prevents sensitive data in output
- Telemetry is opt-in and disabled by default

---

## Documentation

| | |
|---|---|
| [Documentation Hub](docs/) | Full documentation index |
| [CLI Reference](docs/cli-reference.md) | Complete command-line usage |
| [Architecture Guide](docs/architecture.md) | How detection works |
| [Technical FAQ](docs/FAQ.md) | Common questions |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common problems and solutions |
| [Contributing](CONTRIBUTING.md) | How to contribute |
| [Security Policy](SECURITY.md) | Vulnerability reporting |

---

## Community

Questions? Ideas? Found a false positive?

- **GitHub Issues**: [Report bugs or request features](https://github.com/EricCogen/GauntletCI/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/EricCogen/GauntletCI/discussions)
- **Twitter**: [@GauntletCI_BCRV](https://twitter.com/GauntletCI_BCRV)

---

## License

[Elastic License 2.0](LICENSE) — free for personal and internal use.
