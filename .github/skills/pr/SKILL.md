---
name: pr
description: 'Bereitet uncommittete Änderungen für einen Pull Request vor, committet sie nach Prüfung, pusht den Arbeits-Branch und erstellt oder aktualisiert den Pull Request im Remote-Repository. Verwenden bei /pr oder wenn ein Pull Request erstellt werden soll.'
---

# Pull Request erstellen

## Änderungen und Branch prüfen

1. Prüfe Repository-Root, aktuellen Branch und Arbeitsbaum mit `git rev-parse --show-toplevel`, `git branch --show-current` und `git status --short --branch`.
2. Arbeite niemals direkt auf `main` und pushe niemals nach `main`. Wenn `main` aktuell ist, erstelle vor dem Commit einen passenden Topic-Branch, der die Änderung beschreibt, zum Beispiel `feature/...`, `fix/...` oder `docs/...`. Wenn sich kein eindeutiger Branchname ableiten lässt, frage den Nutzer.
3. Prüfe sowohl `git diff` als auch `git diff --cached`. Ordne Änderungen dem gewünschten Arbeitsergebnis zu und committe nur diese. Füge nicht pauschal alle Dateien hinzu. Wenn relevante und sachfremde Änderungen nicht sicher voneinander zu trennen sind, frage nach.
4. Falls keine Änderungen zum Committen vorliegen, prüfe, ob der Branch bereits Commits enthält, die noch nicht in `origin/main` enthalten sind. Ohne solche Änderungen oder Commits gibt es nichts für einen neuen Pull Request; melde das, statt einen leeren Commit anzulegen.

## Commit und Push

1. Führe die passenden Prüfungen für die Änderungen aus. Behaupte keine bestandenen Tests oder Prüfungen, die nicht tatsächlich ausgeführt wurden.
2. Wenn relevante Änderungen noch nicht committet sind, stage nur die dafür benötigten Pfade, prüfe den gestagten Diff und erstelle einen oder mehrere logisch getrennte Commits. Alle Commit-Nachrichten folgen Conventional Commits 1.0.0.
3. Prüfe vor dem Push nochmals Branch, Commit-Historie und Arbeitsbaum. Pushe nur den Topic-Branch mit `git push -u origin <branch>` beziehungsweise `git push`, wenn dessen Upstream bereits eingerichtet ist. Verwende niemals `--force`.

## Pull Request

1. Prüfe mit `gh pr list --head <branch>`, ob bereits ein offener Pull Request für den Branch existiert. Erstelle keinen Duplikat-PR. Zeige in diesem Fall den vorhandenen Pull Request an und aktualisiere ihn nur, wenn dies für die aktuellen Änderungen nötig ist.
2. Erstelle andernfalls mit `gh pr create` einen Pull Request gegen `main`. Verwende einen prägnanten Conventional-Commit-Titel und beschreibe im Text die erledigte Arbeit, relevante Verifikation und bekannte Einschränkungen. Verknüpfe eine zugehörige Issue, wenn vorhanden und zutreffend.
3. Prüfe den erstellten Pull Request mit `gh pr view` und nenne dem Nutzer die URL, die enthaltenen Commits und die tatsächlich ausgeführten Prüfungen.

## Sicherheitsregeln

- Committe keine sachfremden oder nicht autorisierten Änderungen.
- Wenn GitHub CLI nicht angemeldet ist, der Remote fehlt oder ein Git-Schritt fehlschlägt, stoppe und melde den konkreten Blocker. Umgehe den Fehler nicht mit einem Force-Push oder einem Commit auf `main`.