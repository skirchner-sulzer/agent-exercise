# Projektweite Agent-Anweisungen

## Geltungsbereich

- Projektspezifische Skills, Agents und dauerhafte Erinnerungen bleiben in diesem Workspace. Skills liegen in `.github/skills/`, Agent-Definitionen in `.github/agents/`; Erinnerungen sind repositorybezogen.
- Für dieses Projekt keine benutzerweiten oder globalen Skills, Agents oder Erinnerungen erstellen oder ändern.
- Projekt-Skills und Agents nur laden, wenn sie zur Aufgabe passen. Bereits hier oder in der README dokumentierte Regeln nicht unnötig wiederholen.

## Zusammenarbeit und Sprache

- Der Chat wird immer auf Deutsch geführt. Projektdokumentation wird auf Deutsch geschrieben; Source Code, Bezeichner und Code-Kommentare werden auf Englisch verfasst.
- Commit-Nachrichten folgen [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), zum Beispiel `feat: add account settings` oder `docs: describe test workflow`.
- Niemals direkt auf `main` arbeiten. Für jede Änderung einen passenden Branch verwenden, zum Beispiel `feature/...`, `fix/...`, `release/...` oder `docs/...`, und die Änderung über einen Pull Request zum Remote-Repository einreichen.
- Entdeckte, nicht zur aktuellen Änderung gehörende Fehler nicht nebenbei beheben und dafür kein Issue erstellen. Ihre Behebung erfolgt getrennt in einem eigenen Commit.

## Vorgehen bei Änderungen

1. Anforderungen und erwartetes Verhalten konkretisieren und mit passenden Tests beschreiben, bevor die Implementierung beginnt.
2. Die Implementierung erstellen und dabei die Anforderungen und den bestehenden Projektstil einhalten.
3. Die Implementierung gegen jede Anforderung verifizieren und die relevanten Tests ausführen.
4. Rand- und Fehlerfälle untersuchen, fehlende Tests ergänzen und die betroffenen Prüfungen erneut ausführen.
5. Abschließend die deutsche Dokumentation aktualisieren oder ergänzen.

Wenn eine Änderung nicht sinnvoll automatisiert testbar ist, die passende manuelle Verifikation benennen und durchführen.

## Architektur und Projektkonventionen

- Die Anwendung wird nach fachlichen Domänen (Domain-Driven Design) strukturiert. Innerhalb einer Domäne darf zusätzlich nach technischen Verantwortlichkeiten wie `services`, `pages`, `components`, `utils` oder `ui` gegliedert werden.
- Dies ist eine eigenständige Angular-Anwendung mit Routing, Angular Service Worker, Tailwind CSS und NgRx Signal Store.
- Für die Entwicklung `npm start` verwenden; der Dev-Server läuft standardmäßig auf Port `45080`. Bei einer Portänderung `angular.json` und `.vscode/launch.json` synchron halten. Der Test-Debugger verwendet einen separaten Port.
- Tailwind wird in `src/styles.css` importiert. Die Root-Ansicht liegt in `src/app/app.ts`; `src/app/counter.store.ts` zeigt das NgRx-Signal-Store-Muster.
- Der Service Worker ist in Produktions-Builds aktiviert, nicht während der Entwicklung.
- Setup und Standardbefehle stehen in der [README.md](README.md).

## Verifizierung

- Nach Änderungen an der Anwendung `npm run build` ausführen.
- Für einen nicht-interaktiven Testlauf `npm test -- --watch=false` ausführen.