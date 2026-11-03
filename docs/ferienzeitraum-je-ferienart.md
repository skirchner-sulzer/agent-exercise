# Ferienzeitraum je Ferienart anzeigen

## Kontext

Die Gruppierungsüberschrift für Ferienobjekte zeigt derzeit eine Anzahl von Wochen. Statt dieser Wochenzahl soll die Gesamtspanne der Ferienobjekte in der Gruppe erscheinen. Ferienart-Bezeichnung und Spanne stehen in derselben Zeile: Die Bezeichnung steht links, die Spanne rechts. Farbpunkt, Bezeichnung und Spanne sind vertikal ausgerichtet; die Spanne ist kleiner gesetzt als die Überschrift.

## Ziele

- Die Wochenzahl in der Gruppierungsüberschrift durch die Gesamtspanne der Gruppe ersetzen.
- Den Zeitraum gut auffindbar rechts neben der Ferienart-Überschrift in derselben Zeile darstellen.
- Die Spanne für Zeiträume innerhalb eines Jahres und über einen Jahreswechsel eindeutig formatieren.

## Umfang

Für jede Gruppe wird die Gesamtspanne vom frühesten `startDate` bis zum spätesten `endDate` aller Ferienobjekte der Gruppe angezeigt. Die Gesamtspanne umfasst auch Lücken zwischen einzelnen Ferienobjekten.

Die Spanne steht rechts neben der Ferienart-Überschrift in derselben Zeile und ist kleiner gesetzt als diese. Farbpunkt, Bezeichnung und Spanne sind vertikal ausgerichtet. Die bisherige Wochenzahl wird entfernt beziehungsweise ersetzt. Es wird keine Wochenzahl zusätzlich angezeigt.

Die Datumsdarstellung folgt diesen Beispielen:

- Gleiches Jahr: `01.07.–12.07.2026`
- Jahreswechsel: `28.12.2026–08.01.2027`

## Nicht-Ziele

- Eine zusätzliche Anzeige der Wochenanzahl.
- Eine Änderung der Ferienobjekte oder ihrer Start- und Enddaten.
- Eine Änderung der fachlichen Gruppierung der Ferienobjekte.

## Fachliche Entscheidungen

- Die Gesamtspanne beginnt beim frühesten `startDate` aller Ferienobjekte einer Gruppe.
- Die Gesamtspanne endet beim spätesten `endDate` aller Ferienobjekte einer Gruppe.
- Lücken zwischen Ferienobjekten verändern die Gesamtspanne nicht.
- Bei gleichem Start- und Endjahr wird die Jahreszahl einmal am Ende angezeigt.
- Bei einem Jahreswechsel werden beide Jahreszahlen angezeigt.
- Die Wochenzahl wird entfernt beziehungsweise durch die Spanne ersetzt und nicht zusätzlich zur Spanne angezeigt.

## Abnahmekriterien

- Die Gruppierungsüberschrift zeigt anstelle der Wochenzahl die Gesamtspanne der Gruppe.
- Die angezeigte Spanne entspricht dem frühesten `startDate` bis zum spätesten `endDate` aller Ferienobjekte der Gruppe.
- Lücken zwischen den Ferienobjekten liegen innerhalb der angezeigten Gesamtspanne.
- Farbpunkt, Ferienart-Bezeichnung und Spanne stehen in derselben Zeile und sind vertikal ausgerichtet.
- Die Ferienart-Bezeichnung steht links, die Spanne rechts; die Spanne ist kleiner gesetzt als die Überschrift.
- Zeiträume im gleichen Jahr erscheinen im Format `TT.MM.–TT.MM.JJJJ`, zum Beispiel `01.07.–12.07.2026`.
- Zeiträume über einen Jahreswechsel zeigen beide Jahreszahlen, zum Beispiel `28.12.2026–08.01.2027`.
- Neben der Spanne wird keine Wochenzahl angezeigt.

## Verifikationspunkte

- Eine Gruppe mit mehreren Ferienobjekten im selben Jahr.
- Eine Gruppe mit Lücken zwischen ihren Ferienobjekten.
- Eine Gruppe mit Ferienobjekten, deren Gesamtspanne einen Jahreswechsel umfasst.
- Darstellung und Position der Spanne relativ zur Ferienart-Überschrift.
- Prüfung, dass nach der Umstellung keine Wochenzahl zusätzlich angezeigt wird.
