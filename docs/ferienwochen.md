# Ferienzeiträume mit angrenzenden Kalenderwochen

## Kontext

Der Kalender zeigt Schulferien je Jahr, Bundesland und Ferienart. Bisher ist festgelegt, dass dargestellte Wochen vollständig von Montag bis Sonntag reichen und angrenzende Tage außerhalb des ausgewählten Jahres sichtbar bleiben. Nicht festgelegt ist, ob der Kalender zusätzliche Wochen vor und nach Ferienzeiträumen anzeigen soll.

## Ziele

- Ferienzeiträume im Kalender mit je einer vollständigen Kalenderwoche davor und danach einordnen.
- Die bestehenden Regeln für Ferienarten und vollständige Kalenderwochen beibehalten.

## Umfang

Für jeden Ferienzeitraum wird zusätzlich angezeigt:

- die vollständige Kalenderwoche unmittelbar vor der Woche, in der der Ferienzeitraum beginnt;
- die vollständige Kalenderwoche unmittelbar nach der Woche, in der der Ferienzeitraum endet.

Die Erweiterung gilt für alle Ferienzeiträume, unabhängig davon, ob sie einen Jahreswechsel umfassen. Identische Zusatzwochen werden innerhalb desselben Ferienart-Kalenders nur einmal dargestellt. Getrennte Ferienart-Kalender bleiben unabhängig.

## Nicht-Ziele

- Änderungen an der externen Schulferien-API.
- Änderungen an der bestehenden Auswahl von Jahr, Bundesland oder Ferienarten.
- Eine Änderung der bestehenden Montag-bis-Sonntag-Wochenstruktur.

## Annahmen

- „Woche davor“ und „Woche danach“ beziehen sich auf die Wochen vor der Startwoche und nach der Endwoche, nicht auf Wochen relativ zu den einzelnen Start- und Endtagen.
- Die bestehende Regel für angrenzende Tage außerhalb des ausgewählten Jahres gilt auch für die zusätzlich angezeigten Wochen.

## Offene Fragen

Keine fachlichen Rückfragen aus der Anforderungsanalyse.

## Abnahmekriterien

- Zu jedem Ferienzeitraum erscheint die vollständige Woche vor seiner Startwoche und nach seiner Endwoche.
- Die Erweiterung gilt auch für Ferienzeiträume ohne Jahreswechsel.
- Wochen bleiben vollständig von Montag bis Sonntag; die bestehende Darstellung angrenzender Tage außerhalb des ausgewählten Jahres bleibt erhalten.
- Identische Zusatzwochen erscheinen innerhalb eines Ferienart-Kalenders höchstens einmal.
- Ferienarten bleiben in ihren getrennten Kalenderbereichen dargestellt.
- Ferienzeiträume und Zusatzwochen an Jahresgrenzen werden korrekt angezeigt.

## Verifikationspunkte

- Ferienbeginn und Ferienende innerhalb derselben Kalenderwoche.
- Ferienzeiträume über mehrere Wochen und über einen Jahreswechsel.
- Mehrere Ferienzeiträume mit überlappenden Zusatzwochen.
- Getrennte Ferienart-Kalender mit identischen Zusatzwochen.
