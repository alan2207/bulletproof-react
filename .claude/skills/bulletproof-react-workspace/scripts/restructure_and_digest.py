"""Restructure iteration layout for aggregate_benchmark.py and generate
viewer-friendly digest files.

Target layout per eval:
  eval-X/
    eval_metadata.json            (stays; also copied into each config dir)
    with_skill/
      eval_metadata.json          (copy, so viewer finds the prompt)
      run-1/
        grading.json, timing.json, facts.json
        outputs/
          00-changes.md           (digest: file lists)
          01-key-files.md         (digest: key source files)
          app/                    (the actual tree, kept for reference)

Usage: python restructure_and_digest.py <iteration_dir>
"""

import json
import shutil
import sys
from pathlib import Path

KEY_PATTERNS = [
    ".eslintrc.cjs",
    "src/lib/",
    "src/config/",
    "src/app/router.tsx",
    "src/app/provider.tsx",
    "src/features/",
    "tsconfig.json",
    "vite.config.ts",
]
MAX_LINES_PER_FILE = 160
MAX_KEY_FILES = 18


def is_key(rel: str) -> bool:
    return any(rel == p or rel.startswith(p) or (p.endswith("/") and rel.startswith(p)) for p in KEY_PATTERNS)


def make_digests(run1: Path):
    facts_path = run1 / "facts.json"
    app = run1 / "outputs" / "app"
    if not facts_path.exists() or not app.exists():
        return
    facts = json.loads(facts_path.read_text(encoding="utf-8"))

    changes = ["# Changes vs fixture\n"]
    changes.append(f"**Run:** {facts['run']}\n")
    for label, key in [("New files", "new_files"), ("Modified files", "modified_files"), ("Deleted files", "deleted_files")]:
        items = facts.get(key, [])
        changes.append(f"\n## {label} ({len(items)})\n")
        changes.extend(f"- `{f}`" for f in items)
    changes.append("\n\n## Automated checks\n")
    changes.append(f"- New barrel index files: {facts.get('new_barrel_index_files') or 'none'}")
    changes.append(f"- Non-kebab-case new files: {facts.get('non_kebab_new_files') or 'none'}")
    changes.append(f"- .eslintrc.cjs contains import/no-restricted-paths: {facts.get('eslint_has_no_restricted_paths')}")
    zones = facts.get("eslint_zone_mentions") or []
    changes.append(f"- Feature zones mentioned in eslint config: {sorted(set(zones)) or 'none'}")
    (run1 / "outputs" / "00-changes.md").write_text("\n".join(changes), encoding="utf-8")

    changed = facts.get("new_files", []) + facts.get("modified_files", [])
    key_files = [f for f in changed if is_key(f)][:MAX_KEY_FILES]
    parts = ["# Key changed files\n"]
    for rel in key_files:
        p = app / rel
        if not p.exists():
            continue
        try:
            lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError:
            continue
        body = "\n".join(lines[:MAX_LINES_PER_FILE])
        trunc = f"\n... (truncated at {MAX_LINES_PER_FILE} lines)" if len(lines) > MAX_LINES_PER_FILE else ""
        lang = "tsx" if rel.endswith("x") else ("ts" if rel.endswith(".ts") else "js")
        parts.append(f"\n## {rel}\n\n```{lang}\n{body}{trunc}\n```\n")
    (run1 / "outputs" / "01-key-files.md").write_text("\n".join(parts), encoding="utf-8")


def main():
    iteration = Path(sys.argv[1])
    for eval_dir in sorted(iteration.glob("eval-*")):
        meta = eval_dir / "eval_metadata.json"
        for config_dir in sorted(eval_dir.iterdir()):
            if not config_dir.is_dir() or config_dir.name.startswith("run-"):
                continue
            run1 = config_dir / "run-1"
            if not run1.exists():
                run1.mkdir()
                for fname in ("grading.json", "timing.json", "facts.json"):
                    src = config_dir / fname
                    if src.exists():
                        shutil.move(str(src), str(run1 / fname))
                outputs = config_dir / "outputs"
                if outputs.exists():
                    shutil.move(str(outputs), str(run1 / "outputs"))
            if meta.exists():
                shutil.copy(str(meta), str(config_dir / "eval_metadata.json"))
            make_digests(run1)
            print(f"done: {config_dir}")


if __name__ == "__main__":
    main()
