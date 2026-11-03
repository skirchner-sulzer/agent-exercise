---
name: cleanup
description: 'Aktualisiert den lokalen main-Branch und bereinigt vollständig gemergte lokale Branches. Verwenden bei /cleanup oder wenn main synchronisiert und gemergte Branches entfernt werden sollen.'
---

# Repository aufraeumen

## Vorgehen

1. Prüfe Repository-Root, aktuellen Branch und Arbeitsbaum mit `git rev-parse --show-toplevel`, `git branch --show-current` und `git status --short`.
2. Wenn der Arbeitsbaum Änderungen enthält, stoppe vor dem Branch-Wechsel. Nenne die betroffenen Dateien und bitte den Nutzer, die Änderungen zu sichern oder ausdrücklich festzulegen, wie damit umzugehen ist. Stashe oder verwerfe keine Änderungen automatisch.
3. Aktualisiere die Remote-Referenzen mit `git fetch origin`. Wenn `origin` oder der Remote-Branch `origin/main` fehlt, stoppe und melde das Problem.
4. Wechsle mit `git switch main` zu `main` und aktualisiere ihn mit `git pull --ff-only origin main`. Setze `main` niemals zurück und führe keinen automatischen Merge oder Rebase aus. Wenn die Aktualisierung fehlschlägt, stoppe und beschreibe den Zustand.
5. Ermittle mit `git branch --merged main` die lokalen Branches, deren Spitze bereits in `main` enthalten ist. Überspringe `main`; lösche keine Remote-Branches.
6. Lösche die übrigen vollständig gemergten lokalen Branches einzeln mit `git branch -d <branch>`. Verwende niemals `-D`. Wenn Git einen Branch wegen eines Worktrees oder eines anderen Schutzes nicht löscht, lasse ihn bestehen und melde den Grund.
7. Prüfe abschließend mit `git status --short --branch` und berichte, dass `main` aktualisiert wurde, welche lokalen Branches entfernt wurden und welche nicht entfernt werden konnten.

## Sicherheitsregeln

- Lösche nur lokale Branches, die `git branch --merged main` als gemergt ausweist.
- Entferne keine Remote-Branches und lösche oder überschreibe keine Nutzeränderungen.
- Frage nach, wenn die Ausgangslage von diesen Regeln abweicht oder ein sicherer Schritt nicht möglich ist.