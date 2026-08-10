#!/usr/bin/env python3
"""Vendor personal skills into the project's tracked .claude/skills/ tree.

Source of truth is the user-level skills dir (`~/.claude/skills`), itself a
mirror of an external skills repo that gets reinstalled wholesale. So the
project copies are fully *derived*: this tool replaces each listed skill's
directory verbatim, then re-applies the two project-owned divergences we
allow — the model-invocation flag and the `metadata.internal` marker.
Precedent: the same tool in the `crm` Reference Repo.

Run locally after refreshing `~/.claude/skills`, then commit the resulting
`.claude/skills/**` changes. NOT run in CI/cloud (it reads your home dir);
the committed copies are what load in the cloud routine's sandbox, where
personal skills are absent.

Model-invocation review (recorded per issue #5): a skill the docs-ship
chain composes must be model-invokable — `disable-model-invocation` is
stripped so the Skill tool can fire it inside a cloud fire. Outcome per
seed skill lives as the comment on its SYNC line below. The vendored
`agents/openai.yaml` files carry their own invocation policy for a
different runtime; the cloud chain never loads them, so they ship
untouched. The excalidraw
plugin is deliberately NOT vendored: its tools need node_modules plus a
headless Chromium the sandbox cannot be assumed to install, so a cloud fire
hands diagram tickets to a human instead (see docs-ship's blocked hand-off).

Dependency closure: a skill that composes another (referenced as `/other`
or `` `other` `` in its markdown) breaks at runtime if that sibling is
absent from the clone. After seeding from SYNC, the tool transitively pulls
every referenced skill in too — and it scans the project-native skills'
own markdown, so a new reference added to docs-ship lands in the closure
on the next sync. Auto-pulled deps keep their upstream flag.
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path
from typing import TypedDict

SRC = Path("~/.claude/skills").expanduser()
DST = Path(__file__).resolve().parent.parent / ".claude" / "skills"

_SKILL_FILE = "SKILL.md"


class SkillEntry(TypedDict):
    name: str
    model_invokable: bool


# One line per vendored skill. `model_invokable: True` strips
# `disable-model-invocation` from the project copy's frontmatter.
SYNC: list[SkillEntry] = [
    # docs-ship's step-5 review — the fire invokes it via the Skill tool.
    {"name": "code-review", "model_invokable": True},
    # Keeps CLAUDE.md and the docs/agents/ pages current as the Guide
    # grows; chapter tickets that touch agent docs reach it mid-fire.
    {"name": "writing-for-agents", "model_invokable": True},
]

# Referenced from footers/menus but never a runtime dependency.
# `setup-matt-pocock-skills` is an installer meta-skill — a footgun inside
# a repo clone.
EXCLUDE = {"setup-matt-pocock-skills"}

# Hand-authored in this repo — `.claude/skills/` IS their source of truth.
# Never vendor over these.
PROJECT_NATIVE = {"docs-ship", "docs-review"}

# A backticked `/name` or `name` token that matches a known skill directory.
_REF = re.compile(r"`/?([a-z][a-z0-9-]+)`")


def find_refs(skill_dir: Path, universe: set[str]) -> set[str]:
    """Skill names this skill references (composes/invokes) in its markdown."""
    refs: set[str] = set()
    for md in skill_dir.rglob("*.md"):
        for token in _REF.findall(md.read_text(encoding="utf-8")):
            if token in universe:
                refs.add(token)
    return refs


def resolve_closure(seed: dict[str, bool], universe: set[str]) -> tuple[dict[str, bool], set[str]]:
    """Transitively add every referenced skill. Auto-added deps keep their
    upstream flag (model_invokable=False). Returns (name -> force-invokable,
    set-of-auto-added-names).
    """
    wanted = dict(seed)
    auto: set[str] = set()
    # Project-native skills are never vendored, but what they reference
    # must be — scan their tracked copies as closure roots.
    dirs = [SRC / name for name in seed] + [DST / name for name in PROJECT_NATIVE]
    while dirs:
        skill_dir = dirs.pop()
        if not skill_dir.is_dir():
            continue
        for dep in find_refs(skill_dir, universe) - set(wanted) - EXCLUDE - PROJECT_NATIVE:
            wanted[dep] = False
            auto.add(dep)
            dirs.append(SRC / dep)
    return wanted, auto


def strip_model_invocation_flag(skill_md: Path) -> bool:
    """Remove `disable-model-invocation` from the YAML frontmatter only.

    The body must be left untouched — e.g. writing-for-agents' prose
    literally contains the string `disable-model-invocation: true`. Returns
    True if a line was removed.
    """
    lines = skill_md.read_text(encoding="utf-8").splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return False
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return False
    kept = [
        ln
        for i, ln in enumerate(lines)
        if not (1 <= i < end and ln.split(":", 1)[0].strip() == "disable-model-invocation")
    ]
    if len(kept) != len(lines):
        skill_md.write_text("".join(kept), encoding="utf-8")
        return True
    return False


def stamp_internal_flag(skill_md: Path) -> bool:
    """Add `metadata.internal: true` to the YAML frontmatter if absent.

    The `vercel-labs/skills` installer hides a skill from normal discovery
    when its frontmatter carries `metadata.internal: true`. These vendored
    copies are lane tooling, not end-user skills, so every synced copy
    carries the flag — re-stamped on each sync because the upstream source
    lacks it. Idempotent; touches only the frontmatter, never the body.
    """
    lines = skill_md.read_text(encoding="utf-8").splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return False
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return False
    meta_idx = next(
        (
            i
            for i in range(1, end)
            if lines[i][:1] not in (" ", "\t") and lines[i].split(":", 1)[0].strip() == "metadata"
        ),
        None,
    )
    if meta_idx is None:
        if not lines[end - 1].endswith("\n"):
            lines[end - 1] += "\n"
        lines.insert(end, "metadata:\n  internal: true\n")
        skill_md.write_text("".join(lines), encoding="utf-8")
        return True
    j = meta_idx + 1
    while j < end and (not lines[j].strip() or lines[j][:1] in (" ", "\t")):
        if lines[j].split(":", 1)[0].strip() == "internal":
            if lines[j].strip() == "internal: true":
                return False
            indent = lines[j][: len(lines[j]) - len(lines[j].lstrip())]
            lines[j] = f"{indent}internal: true\n"
            skill_md.write_text("".join(lines), encoding="utf-8")
            return True
        j += 1
    lines.insert(meta_idx + 1, "  internal: true\n")
    skill_md.write_text("".join(lines), encoding="utf-8")
    return True


def _apply_flags(dst: Path, force_invokable: bool, is_dep: bool) -> str:
    """Re-apply the project-owned frontmatter divergences to a freshly
    copied vendored skill; return a human-readable tag of what changed.
    """
    tag = " [dep]" if is_dep else ""
    if force_invokable:
        stripped = strip_model_invocation_flag(dst / _SKILL_FILE)
        if stripped:
            tag += " (stripped disable-model-invocation)"
    if stamp_internal_flag(dst / _SKILL_FILE):
        tag += " (marked internal)"
    return tag


def main() -> int:
    if not SRC.is_dir():
        print(f"error: source skills dir not found: {SRC}", file=sys.stderr)
        return 1

    universe = {p.name for p in SRC.iterdir() if p.is_dir()}
    seed = {e["name"]: e["model_invokable"] for e in SYNC}
    wanted, auto = resolve_closure(seed, universe)

    clash = PROJECT_NATIVE & set(wanted)
    if clash:
        print(
            f"error: refusing to overwrite project-native skill(s): {', '.join(sorted(clash))}",
            file=sys.stderr,
        )
        return 1

    DST.mkdir(parents=True, exist_ok=True)
    missing: list[str] = []
    for name in sorted(wanted):
        src, dst = SRC / name, DST / name
        if not src.is_dir():
            missing.append(name)
            continue
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        print(f"synced {name}{_apply_flags(dst, wanted[name], name in auto)}")

    if missing:
        print(f"\nerror: not found under {SRC}: {', '.join(missing)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
