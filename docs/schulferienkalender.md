# Schulferienkalender

## Kontext

Die Anwendung soll Schulferien je Jahr und Bundesland in einem Kalender darstellen. Nutzerinnen und Nutzer sollen Ferienarten gezielt filtern können. Die Datenquelle ist https://schulferien-api.de/.

Das Repository verwendet Angular 22, NgRx Signal Store, Tailwind CSS und Angular Service Worker. Die Spartan-UI-Versionsmatrix weist Angular 22 als unterstützt aus; auch `@spartan-ng/brain` 1.9.0 erlaubt Angular-Versionen ab 21 und kleiner als 23. Spartan UI wurde nicht integriert, da native HTML-Controls die benötigten Auswahl-, Dialog- und Filterinteraktionen abdecken und keine zusätzliche UI-Abhängigkeit erforderlich ist.

## DataProvider V2

Die Anwendung verwendet die erweiterte API V2. Für Jahr und Bundesland lautet der Abruf `GET https://schulferien-api.de/api/v2/{jahr}?states={code}`, zum Beispiel `GET https://schulferien-api.de/api/v2/2026?states=BY`. Die API liefert eine Liste von Ferienobjekten mit `start`, `end`, `year`, `stateCode`, `name`, `name_cp`, `slug` und `id`. Die Anwendung normalisiert `start` und `end` zu Datumswerten ohne Uhrzeit und bildet `name` auf den Ferienart-Schlüssel sowie `name_cp` auf die angezeigte Bezeichnung ab.

Die API-Dokumentation weist die Jahre 2022 bis 2029 und alle 16 Bundesländer aus. Die Auswahl beschränkt sich auf diese Werte. Der ursprüngliche API-Payload wird je Jahr und Bundesland unter einem versionsgebundenen Schlüssel in `localStorage` gespeichert und beim Auslesen normalisiert. Ungültige Antworten werden nicht gecacht; bei einem ungültigen Refresh bleibt ein vorheriger erfolgreicher Cache erhalten. Offline wird ausschließlich dieser lokale Bestand gelesen; ohne Cache bleibt die Auswahl leer. Schlägt ein Online-Abruf fehl, werden gespeicherte Daten als Rückfall angezeigt. Die Reload-Aktion nutzt denselben Online-Check und löst offline keinen API-Aufruf aus.

## Ziele

- Schulferien für ein auswählbares Jahr und Bundesland anzeigen.
- Das aktuelle Jahr und Bayern als Standardauswahl verwenden.
- Kalenderwochen vollständig von Montag bis Sonntag darstellen, einschließlich angrenzender Tage außerhalb des ausgewählten Jahres.
- Ferienarten getrennt darstellen und über Farben unterscheidbar machen.
- Eine Auswahl der sichtbaren Ferienarten über ein Filter-Popup ermöglichen.
- Bereits verfügbare Daten offline anzeigen und offline keine API-Abrufe versuchen.
- Eine About-Ansicht sowie eine PWA-Installationsanleitung anbieten.
- Safe-Area-Insets an oberen und unteren Bildschirmrändern berücksichtigen.

## Umfang

### Auswahl von Jahr und Bundesland

Jahr und Bundesland werden im Header angezeigt. Ein Dialog ermöglicht die Auswahl beider Werte. Die Auswahl der Kalenderdaten orientiert sich an den von der Datenquelle unterstützten Werten.

### Kalender und Ferienarten

Der Kalender zeigt vollständige Montag-bis-Sonntag-Wochen. Tage außerhalb des ausgewählten Jahres bleiben sichtbar, wenn sie zu einer dargestellten Woche gehören. Schulferien werden visuell hervorgehoben.

Zu jedem Ferienzeitraum zeigt der Kalender zusätzlich die vollständige Woche vor seiner Startwoche und nach seiner Endwoche. Diese Regel gilt auch über Jahresgrenzen hinweg; benötigte Wochen außerhalb des ausgewählten Jahres bleiben vollständig sichtbar. Überschneidende Zusatzwochen werden innerhalb eines Ferienart-Kalenders nur einmal dargestellt. Ferienarten bleiben voneinander unabhängig.

Für jede Ferienart wird ein eigener Kalenderbereich dargestellt. Eine konsistente Farbdifferenzierung kennzeichnet die Ferienarten. Die Farbpalette umfasst:

In derselben Zeile wie die Überschrift jeder Ferienart steht rechts die Gesamtspanne ihrer Ferienobjekte, während die Bezeichnung links steht. Farbpunkt, Bezeichnung und Spanne sind vertikal ausgerichtet; die Spanne ist kleiner gesetzt als die Überschrift. Sie reicht vom frühesten Start- bis zum spätesten Enddatum, einschließlich möglicher Lücken. Innerhalb desselben Jahres wird die Jahreszahl nur am Ende angezeigt (`01.07.–12.07.2026`); bei einem Jahreswechsel stehen beide Jahreszahlen in der Spanne (`28.12.2026–08.01.2027`). Eine Wochenanzahl wird im Abschnittskopf nicht zusätzlich angezeigt.

- Primary: `oklch(68.5% 0.169 237.323)`
- Secondary: `oklch(55.4% 0.046 257.417)`
- Accent: `oklch(69.6% 0.17 162.48)`

### Filter

Das Filter-Popup enthält je Ferienart eine Checkbox sowie die Aktionen „Alles auswählen“ und „Auswahl umkehren“. Die Kalenderbereiche werden entsprechend der aktiven Auswahl angezeigt.

### Daten und Offline-Verhalten

Online werden Daten von https://schulferien-api.de/ über die V2-API geladen. Lokal bereits verfügbare Daten werden auch offline genutzt. Im Offline-Modus werden keine Abrufe an die API versucht.

Ein Reload-Steuerelement bietet eine Aktualisierung der Daten. Online kann es einen erneuten Abruf anstoßen; offline darf es keinen API-Abruf auslösen.

### Toolbar und About

Eine abgerundete Toolbar liegt oberhalb des Hauptinhalts und enthält Reload sowie einen Info-/About-Aufruf. Die About-Ansicht zeigt:

- Anwendungsnamen und Version
- Git-Repository-URL
- DataProvider-URL
- Anleitung zur PWA-Installation

### Gestaltung und Technik

Die Anwendung verwendet Angular 22, NgRx Signal Store und Tailwind CSS. Als Farbwerte gelten die oben genannten Primary-, Secondary- und Accent-Farben. Safe-Area-Insets müssen bei der Gestaltung der Bildschirmränder berücksichtigt werden.

Die Kompatibilität von Spartan UI mit Angular 22 wurde anhand der [offiziellen Versionsmatrix](https://www.spartan.ng/documentation/version-support) und der Peer-Dependencies von `@spartan-ng/brain` 1.9.0 geprüft. Die Anwendung verwendet dennoch native HTML-Controls; die kompatible Bibliothek ist keine Laufzeitabhängigkeit.

## Nicht-Ziele

- Änderungen oder Erweiterungen an der externen Schulferien-API.
- Eine nicht durch die Anforderungen begründete Festlegung auf einen konkreten Zeitraum für die Jahresauswahl.
- Eine Festlegung auf eine bestimmte Offline-Speicherstrategie, bevor die vorhandene PWA-Konfiguration und das Datenverhalten geprüft wurden.

## Annahmen

- Verfügbare Jahre und Bundesländer lassen sich anhand der Datenquelle bestimmen.
- „Bereits verfügbare Daten“ bezeichnet Daten, die die Anwendung zuvor lokal verfügbar gemacht hat.
- Die Git-Repository-URL und die Quelle für die angezeigte Anwendungsversion werden im Projekt geprüft, bevor sie in der About-Ansicht festgelegt werden.
- Die vorgegebenen Farbwerte sind verbindlich; die konkrete Zuordnung zu Ferienarten muss eine klare visuelle Unterscheidung ermöglichen.

## Verbleibende Prüfgrenzen

- Die Safe-Area-Regeln wurden im CSS geprüft, aber nicht mit nicht-null Safe-Area-Inset-Werten auf physischer Notch-Hardware verifiziert.
- AXE wurde nicht ausgeführt; die automatisierten Tastatur- und Fokusprüfungen ersetzen keinen vollständigen Accessibility-Audit.

## Umsetzung und Verifikation

1. Datenvertrag, unterstützte Jahre und Bundesländer sowie die Kompatibilität von Spartan UI prüfen.
2. Datenabruf und Offline-Verhalten so umsetzen, dass verfügbare lokale Daten angezeigt und offline keine API-Abrufe versucht werden.
3. Kalenderwochen, angrenzende Tage, Ferienhervorhebung und getrennte Bereiche je Ferienart umsetzen.
4. Jahr-/Bundeslanddialog, Ferienartenfilter, Toolbar und About-Ansicht ergänzen.
5. Farben, Safe-Area-Abstände und PWA-Installationshinweise überprüfen.
6. Relevante automatisierte Tests ausführen und `npm run build` sowie `npm test -- --watch=false` prüfen.
7. Offline-Verhalten und Safe-Area-Darstellung zusätzlich manuell oder mit geeigneter Browserprüfung verifizieren.

Die automatisierten Regressionstests decken den API-freien Offline-Reload, normalisierte Metadaten, den Cache bei ungültigen Einzel-Datensätzen, vollständige gerenderte 7-Tage-Wochen, Feiertagsmarkierungen, Ferienart-Checkboxen, den Online-Reload mit aktualisiertem Kalender und Store-Zustand sowie Fokus, Tab-Umlauf und Escape für die Dialoge ab.

Eine Playwright-Prüfung im emulierten Viewport 390 × 844 wurde ausgeführt: Dokument- und Viewportbreite betrugen beide 390 Pixel, es gab keinen horizontalen Überlauf, der Header lag bei 0–77 Pixeln und die Toolbar am unteren Viewportrand bei 844 Pixeln. Kalenderdarstellung und Dialoge wurden geprüft; der Filter enthielt sechs Checkboxen, und der About-Dialog zeigte die erwarteten Angaben und gab den Fokus nach Escape an seinen Auslöser zurück. Dies ist keine Prüfung auf physischer Hardware: Safe-Area-Inset- beziehungsweise Notch-Verhalten wurde nicht auf einem Gerät verifiziert. AXE wurde nicht ausgeführt.

## Abnahmekriterien

- Beim Start sind aktuelles Jahr und Bayern ausgewählt; Auswahländerungen aktualisieren den Kalender.
- Der Kalender zeigt vollständige Montag-bis-Sonntag-Wochen einschließlich angrenzender Tage außerhalb des Jahres.
- Zu jedem Ferienzeitraum erscheinen die vollständige Woche vor der Startwoche und nach der Endwoche; gemeinsame Zusatzwochen werden je Ferienart-Kalender dedupliziert.
- Schulferien sind hervorgehoben und je Ferienart separat sowie farblich unterscheidbar dargestellt.
- Checkboxen, „Alles auswählen“ und „Auswahl umkehren“ steuern die sichtbaren Ferienarten wie beschrieben.
- Online können Daten geladen und über Reload aktualisiert werden.
- Offline bleiben bereits verfügbare Daten sichtbar; es werden keine API-Abrufe versucht.
- Die About-Ansicht enthält Name, Version, Repository-URL, DataProvider-URL und PWA-Installationsanleitung.
- Die Safe-Area-Insets verhindern, dass Inhalte an Notch-Geräten verdeckt werden.
- Spartan UI wird nur eingesetzt, wenn die Kompatibilität mit Angular 22 bestätigt wurde; andernfalls wird die Entscheidung vor einer Abweichung eingeholt.
