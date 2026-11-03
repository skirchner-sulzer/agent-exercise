# Projektdokumentation und Memory

Die dauerhafte Projektdokumentation liegt in diesem Verzeichnis. Die Root-README dient als Einstieg für Setup und Standardbefehle; ausführliche Themen werden hier dokumentiert.

## Struktur

- Lege fachliche Dokumentation nach Möglichkeit thematisch oder nach Business-Domäne ab.
- Lege repositorybezogene Memory-Notizen unter `docs/memory/` ab, jeweils in einer knappen Markdown-Datei pro Thema, zum Beispiel `architecture.md`, `testing.md` oder `tooling.md`.
- Ergänze diese Übersicht, wenn die Dokumentationsstruktur deutlich wächst.

## Issue-Agenten

Für die Issue-Arbeit liegen vier Workspace-Agenten unter `.github/agents/`: `Analyse` klärt Anforderungen, erstellt bestätigte Issues mit Abnahmekriterien und ordnet sie nach Nutzerabnahme zur Übergabe an `Developer`; `Developer` implementiert und reviewed, `Tester` prüft Testabdeckung und Edge-Cases, `Business` erteilt die fachliche Freigabe. Die Übergaben und Rückgaben sind in den Agent-Dateien beschrieben. Alle Rollen müssen weiterhin den verbindlichen Ablauf in `.github/skills/issue/SKILL.md` einhalten.

## Pflege

- Lies vor einer passenden Änderung die relevanten Dokumente und Memory-Notizen.
- Aktualisiere Dokumentation und Memory nach der Verifikation als letzten Arbeitsschritt. Speichere nur überprüfte, dauerhaft hilfreiche Erkenntnisse, Entscheidungen und Projektkonventionen.
- Schreibe auf Deutsch und halte Notizen präzise, umsetzbar und thematisch fokussiert. Vermeide Duplikate zu `AGENTS.md` und der Root-README.
- Speichere keine Zugangsdaten, personenbezogenen Informationen oder flüchtigen Sitzungsverläufe. Benutzerweite Präferenzen gehören nicht in das Repository.