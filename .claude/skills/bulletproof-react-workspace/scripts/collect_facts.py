"""Collect objective facts from each eval run's output app for grading.

Usage: python collect_facts.py <iteration_dir> <fixtures_dir>
Writes facts.json into each <eval>/<arm>/ directory and prints a summary.
"""

import hashlib
import json
import re
import sys
from pathlib import Path

EVAL_FIXTURE = {
    "eval-0-scaffold-feature-bare-app": "bare-vite-app",
    "eval-1-add-feature-established-app": "established-app",
    "eval-2-api-foundation-setup": "bare-vite-app",
}

SKIP_DIRS = {"node_modules", ".git", "dist"}


def file_map(root: Path):
    out = {}
    for p in root.rglob("*"):
        if p.is_dir():
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        rel = p.relative_to(root).as_posix()
        try:
            out[rel] = hashlib.md5(p.read_bytes()).hexdigest()
        except OSError:
            out[rel] = "<unreadable>"
    return out


def is_kebab(name: str) -> bool:
    stem = name.split(".")[0]
    return bool(re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", stem))


def grep(root: Path, files, pattern):
    """Return {file: [matching lines]} for changed files only."""
    rx = re.compile(pattern)
    hits = {}
    for rel in files:
        p = root / rel
        if not p.exists() or p.suffix not in {".ts", ".tsx", ".cjs", ".js", ".jsx", ".json"}:
            continue
        try:
            lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError:
            continue
        m = [ln.strip() for ln in lines if rx.search(ln)]
        if m:
            hits[rel] = m[:6]
    return hits


def main():
    iteration = Path(sys.argv[1])
    fixtures = Path(sys.argv[2])

    for eval_dir in sorted(iteration.iterdir()):
        if not eval_dir.is_dir() or not eval_dir.name.startswith("eval-"):
            continue
        fixture_name = EVAL_FIXTURE.get(eval_dir.name)
        if not fixture_name:
            continue
        base = file_map(fixtures / fixture_name)
        for arm in ("with_skill", "without_skill", "old_skill"):
            app = eval_dir / arm / "outputs" / "app"
            if not app.exists():
                continue
            cur = file_map(app)
            new_files = sorted(f for f in cur if f not in base)
            modified = sorted(f for f in cur if f in base and cur[f] != base[f])
            deleted = sorted(f for f in base if f not in cur)
            changed = new_files + modified

            def is_reexport_barrel(rel):
                if Path(rel).name not in {"index.ts", "index.tsx"}:
                    return False
                try:
                    text = (app / rel).read_text(encoding="utf-8", errors="replace")
                except OSError:
                    return False
                return bool(re.search(r"export\s+(\*|\{[^}]*\})\s+from", text))

            new_barrels = [f for f in new_files if "src/" in f and is_reexport_barrel(f)]
            feature_barrels = [f for f in new_barrels if "src/features/" in f]
            non_kebab_new = [
                f for f in new_files
                if f.startswith("src/")
                and "__tests__" not in f
                and not is_kebab(Path(f).name)
            ]
            eslintrc = app / ".eslintrc.cjs"
            eslint_text = eslintrc.read_text(encoding="utf-8", errors="replace") if eslintrc.exists() else ""

            facts = {
                "run": f"{eval_dir.name}/{arm}",
                "new_files": new_files,
                "modified_files": modified,
                "deleted_files": deleted,
                "new_barrel_index_files": new_barrels,
                "new_feature_barrels": feature_barrels,
                "non_kebab_new_files": non_kebab_new,
                "eslint_has_no_restricted_paths": "no-restricted-paths" in eslint_text,
                "eslint_zone_mentions": re.findall(r"features/[a-z0-9-]+", eslint_text),
                "greps": {
                    "queryOptions_factory": grep(app, changed, r"queryOptions\s*\("),
                    "queryConfig_param": grep(app, changed, r"queryConfig"),
                    "mutationConfig_param": grep(app, changed, r"mutationConfig"),
                    "zod_schema": grep(app, changed, r"z\.object\s*\("),
                    "invalidateQueries": grep(app, changed, r"invalidateQueries"),
                    "string_literal_querykey": grep(app, changed, r"queryKey:\s*\["),
                    "interceptors": grep(app, changed, r"interceptors\.(request|response)"),
                    "withCredentials": grep(app, changed, r"withCredentials"),
                    "response_unwrap": grep(app, changed, r"return\s+response\.data|=>\s*response\.data"),
                    "status_401": grep(app, changed, r"401"),
                    "staleTime": grep(app, changed, r"staleTime"),
                    "QueryConfig_type": grep(app, changed, r"export\s+type\s+(QueryConfig|MutationConfig|ApiFnReturnType)"),
                    "env_zod": grep(app, changed, r"safeParse|EnvSchema|createEnv"),
                    "queryclient_once": grep(app, changed, r"useState\(\s*\(\)\s*=>\s*new QueryClient|new QueryClient\("),
                    "lazy_routes": grep(app, changed, r"lazy:\s*\(\)\s*=>\s*import"),
                    "paths_registry": grep(app, changed, r"getHref"),
                    "relative_parent_imports": grep(app, changed, r"from\s+'\.\./\.\."),
                },
            }
            out = eval_dir / arm / "facts.json"
            out.write_text(json.dumps(facts, indent=2), encoding="utf-8")
            print(f"{facts['run']}: {len(new_files)} new, {len(modified)} modified, "
                  f"barrels={len(new_barrels)}, non_kebab={len(non_kebab_new)}, "
                  f"zones={facts['eslint_has_no_restricted_paths']}")


if __name__ == "__main__":
    main()
