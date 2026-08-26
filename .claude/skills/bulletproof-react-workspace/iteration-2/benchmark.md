# Skill Benchmark: bulletproof-react

**Model**: <model-name>
**Date**: 2026-08-26T00:31:09Z
**Evals**: 0, 1, 2 (3 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 92% ± 14% | +0.08 |
| Time | 356.0s ± 113.9s | 542.8s ± 219.9s | -186.8s |
| Tokens | 101049 ± 13202 | 107861 ± 12646 | -6812 |

## Notes

- Iteration 2 = the review-fixed skill (barrel rule rescoped to feature modules, real repo loader/ESLint config shapes, completeness gaps filled) vs a fresh no-skill baseline; same prompts as iteration 1.
- Pass-rate delta doubled to +8pp, again entirely from eval-0 (bare app): the baseline this round built a LOAD-BEARING feature barrel (src/features/tasks/index.ts) and lint-banned direct imports — the exact inverse of the bulletproof convention — and again enforced boundaries with core no-restricted-imports rather than import/no-restricted-paths zones (6/8). The with-skill run followed the rescoped rule precisely: ui barrels only, none in the feature (8/8).
- eval-1 (established app) tied 8/8 both arms and this time also tied on time (287s vs 290s) — grader notes the fixture makes every assertion satisfiable by mirroring the adjacent discussions folder; it measures copy-the-neighbor, not skill lift. Keep as regression guard.
- eval-2 tied 8/8 but with-skill was 55% faster (293s vs 649s) and 14% cheaper in tokens; two baseline passes were on-outcome judgment calls (unwrap in an api facade instead of the interceptor; withCredentials on create() instead of the interceptor).
- Efficiency: totals 1068s vs 1629s (-34% wall clock), 303k vs 324k tokens (-6%). Consistent with iteration 1 (-29%): the skill front-loads conventions the baseline re-derives.
- The rescoped barrel assertion + content-based detector produced zero false positives this round (iteration-1 had one: a composition-root index.tsx flagged by filename).
- Standing grader asks, unchanged from iteration 1: no compile/lint gate (fixtures ship without node_modules), no endpoint-URL or validated-env-usage checks, mock-backend wiring uncovered. These need either an npm-install step in the harness or accepting structural-only grading.
