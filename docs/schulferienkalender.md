# Schulferienkalender

## Kontext

Die Anwendung soll Schulferien je Jahr und Bundesland in einem Kalender darstellen. Nutzerinnen und Nutzer sollen Ferienarten gezielt filtern können. Die Datenquelle ist https://schulferien-api.de/.

Das Repository verwendet Angular 22, NgRx Signal Store, Tailwind CSS und Angular Service Worker. Spartan UI ist derzeit nicht als Abhängigkeit installiert. Seine Kompatibilität mit der vorhandenen Angular-Version ist vor einem Einsatz zu prüfen.

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

Für jede Ferienart wird ein eigener Kalenderbereich dargestellt. Eine konsistente Farbdifferenzierung kennzeichnet die Ferienarten. Die Farbpalette umfasst:

- Primary: `oklch(68.5% 0.169 237.323)`
- Secondary: `oklch(55.4% 0.046 257.417)`
- Accent: `oklch(69.6% 0.17 162.48)`

### Filter

Das Filter-Popup enthält je Ferienart eine Checkbox sowie die Aktionen „Alles auswählen“ und „Auswahl umkehren“. Die Kalenderbereiche werden entsprechend der aktiven Auswahl angezeigt.

### Daten und Offline-Verhalten

Online werden Daten von https://schulferien-api.de/ geladen. Lokal bereits verfügbare Daten sollen auch offline nutzbar sein. Im Offline-Modus werden keine Abrufe an die API versucht.

Ein Reload-Steuerelement bietet eine Aktualisierung der Daten. Online kann es einen erneuten Abruf anstoßen; offline darf es keinen API-Abruf auslösen.

### Toolbar und About

Eine abgerundete Toolbar liegt oberhalb des Hauptinhalts und enthält Reload sowie einen Info-/About-Aufruf. Die About-Ansicht zeigt:

- Anwendungsnamen und Version
- Git-Repository-URL
- DataProvider-URL
- Anleitung zur PWA-Installation

### Gestaltung und Technik

Die Anwendung verwendet Angular 22, NgRx Signal Store und Tailwind CSS. Als Farbwerte gelten die oben genannten Primary-, Secondary- und Accent-Farben. Safe-Area-Insets müssen bei der Gestaltung der Bildschirmränder berücksichtigt werden.

Der Einsatz von Spartan UI setzt eine vorherige Prüfung der Kompatibilität mit der vorhandenen Angular-Version voraus. Eine nicht bestätigte Kompatibilität gilt nicht als geklärt; eine alternative Entscheidung ist vor der Umsetzung einzuholen.

## Nicht-Ziele

- Änderungen oder Erweiterungen an der externen Schulferien-API.
- Eine nicht durch die Anforderungen begründete Festlegung auf einen konkreten Zeitraum für die Jahresauswahl.
- Eine Festlegung auf eine bestimmte Offline-Speicherstrategie, bevor die vorhandene PWA-Konfiguration und das Datenverhalten geprüft wurden.

## Annahmen

- Verfügbare Jahre und Bundesländer lassen sich anhand der Datenquelle bestimmen.
- „Bereits verfügbare Daten“ bezeichnet Daten, die die Anwendung zuvor lokal verfügbar gemacht hat.
- Die Git-Repository-URL und die Quelle für die angezeigte Anwendungsversion werden im Projekt geprüft, bevor sie in der About-Ansicht festgelegt werden.
- Die vorgegebenen Farbwerte sind verbindlich; die konkrete Zuordnung zu Ferienarten muss eine klare visuelle Unterscheidung ermöglichen.

## Offene Fragen und technische Risiken

- Welche Jahreswerte und Bundesländer stellt die Datenquelle tatsächlich bereit?
- Wie werden Daten lokal verfügbar gehalten, und welches Verhalten ist beim ersten Offline-Aufruf ohne zuvor verfügbare Daten vorgesehen?
- Welche Ferienarten liefert die Datenquelle, und reichen die festgelegten Farbrollen für ihre eindeutige Unterscheidung aus?
- Ist Spartan UI mit der im Projekt verwendeten Angular-Version kompatibel?
- Welche Browser-spezifischen Hinweise sind für die PWA-Installationsanleitung erforderlich?
- Woher sollen Versionsnummer und Git-Repository-URL zur Laufzeit beziehungsweise beim Build bezogen werden?

Diese Punkte sind vor oder während der Umsetzung zu prüfen. Sie gelten nicht als bereits verifizierte technische Entscheidungen.

## Umsetzung und Verifikation

1. Datenvertrag, unterstützte Jahre und Bundesländer sowie die Kompatibilität von Spartan UI prüfen.
2. Datenabruf und Offline-Verhalten so umsetzen, dass verfügbare lokale Daten angezeigt und offline keine API-Abrufe versucht werden.
3. Kalenderwochen, angrenzende Tage, Ferienhervorhebung und getrennte Bereiche je Ferienart umsetzen.
4. Jahr-/Bundeslanddialog, Ferienartenfilter, Toolbar und About-Ansicht ergänzen.
5. Farben, Safe-Area-Abstände und PWA-Installationshinweise überprüfen.
6. Relevante automatisierte Tests ausführen und `npm run build` sowie `npm test -- --watch=false` prüfen.
7. Offline-Verhalten und Safe-Area-Darstellung zusätzlich manuell oder mit geeigneter Browserprüfung verifizieren.

## Abnahmekriterien

- Beim Start sind aktuelles Jahr und Bayern ausgewählt; Auswahländerungen aktualisieren den Kalender.
- Der Kalender zeigt vollständige Montag-bis-Sonntag-Wochen einschließlich angrenzender Tage außerhalb des Jahres.
- Schulferien sind hervorgehoben und je Ferienart separat sowie farblich unterscheidbar dargestellt.
- Checkboxen, „Alles auswählen“ und „Auswahl umkehren“ steuern die sichtbaren Ferienarten wie beschrieben.
- Online können Daten geladen und über Reload aktualisiert werden.
- Offline bleiben bereits verfügbare Daten sichtbar; es werden keine API-Abrufe versucht.
- Die About-Ansicht enthält Name, Version, Repository-URL, DataProvider-URL und PWA-Installationsanleitung.
- Die Safe-Area-Insets verhindern, dass Inhalte an Notch-Geräten verdeckt werden.
- Spartan UI wird nur eingesetzt, wenn die Kompatibilität mit Angular 22 bestätigt wurde; andernfalls wird die Entscheidung vor einer Abweichung eingeholt.
