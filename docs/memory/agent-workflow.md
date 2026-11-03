# Agent workflow and session consistency

## Analysis agent

- The `Analyse` agent is reserved for clarifying requirements and producing an Epic/feature document under `docs/`.
- It must not independently create task-level GitHub issues, start implementation, or treat the draft as an approved engineering task.
- It may ask for clarifications and produce a concept document with acceptance criteria.
- The approval of the Epic by the user is the gate for any follow-up implementation or task breakdown.

## Developer handoff

- After approval, `Developer` breaks the Epic into concrete technical tasks.
- Task issues, subtasks, and implementation work happen only after the Epic has been explicitly accepted.

## Session consistency

- New sessions must read the repository rules in `AGENTS.md` and the issue workflow in `.github/skills/issue/SKILL.md` before acting.
- The repository-level rule is: Epic first, implementation second, user approval required before any task-level issue or code change.
