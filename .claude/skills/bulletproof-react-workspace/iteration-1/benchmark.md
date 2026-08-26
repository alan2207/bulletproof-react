# Skill Benchmark: bulletproof-react

**Model**: <model-name>
**Date**: 2026-08-25T23:54:14Z
**Evals**: 0, 1, 2 (3 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 96% ± 7% | +0.04 |
| Time | 386.4s ± 179.6s | 544.2s ± 197.2s | -157.8s |
| Tokens | 102758 ± 16362 | 107003 ± 5086 | -4245 |

## Notes

- Pass-rate delta (+4pp) comes entirely from eval-0 (bare app): the baseline enforced import boundaries via core no-restricted-imports globs (layer-wide, misses relative ../ escapes, no per-feature zones) instead of import/no-restricted-paths zones; the with-skill run produced exact per-feature zones plus the unidirectional zones. Same failure class as the previous rounds lint-clean trap.
- eval-1 (established app) tied 8/8 in both arms — the baseline reconstructed every convention, including the ESLint zone registration, from the legible codebase. Replicates the prior finding that review/mimicry of a well-patterned repo does not need the skill for accuracy. The discriminator was latency: 210s vs 330s (-36%) and 93k vs 105k tokens.
- eval-2 tied on structural assertions (graders judged them presence-checks a strong baseline satisfies unaided) but with-skill finished in 379s vs 719s (-47%). Keep eval-2 as a regression guard; judge it on time, not pass rate.
- Consistent efficiency win with skill: total wall-clock 1159s vs 1633s (-29%); tokens 308k vs 321k. The skill front-loads conventions the baseline re-derives by exploration/deliberation.
- Grader-flagged eval gaps for iteration 2: no compile/lint gate (outputs ship without node_modules); nothing verifies endpoint URLs (a copy-paste /discussions fetcher would pass); mock-backend wiring (db model, handlers, registration) uncovered; the facts-script barrel detector matches filename rather than re-export content and false-positived app/index.tsx (a composition root, identical in shape to the reference app itself).
- Baselines are notably stronger than in the 70-day-old eval round (Opus baseline now adds zones in the established app unprompted). The skills accuracy edge concentrates where no in-repo exemplar exists and the enforcement mechanism is non-obvious.
