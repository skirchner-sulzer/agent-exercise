# Komponenten-Refactoring des Ferienkalenders

## Ziel

Die bestehende Darstellung des Ferienkalenders wird in klar abgegrenzte Angular-Standalone-Komponenten aufgeteilt. Layout, Kalenderverhalten, Filter und Dialoge bleiben unverändert; die App behält die Business-Logik.

## Komponenten

- `HolidayGrid` bündelt eine Ferienart mit Titel, Datumsbereich, Farbpalette, oberer Border und Wochenraster.
- `HolidayTitle` zeigt Ferienart, Datumsbereich und den zugeordneten Accent-Farbmarker.
- `HolidayBorder` zeichnet die obere Linie in der Accent-Farbe.
- `HolidayWeek` zeigt Kalenderwoche sowie Montag bis Sonntag. Ferien-Tage werden mit der Light-Accent-Farbe und einem kleinen Accent-Punkt markiert.
- `Toolbar` bleibt am Viewport fixiert über dem Main Content, erhält einen dezenten Glow und meldet Aktionen über Outputs an die App.

Darzustellende Daten werden über Angular-Inputs übergeben. Die Komponenten verwenden die funktionalen Input-/Output-APIs statt Dekorator-APIs. Das App-Template liegt in `src/app/app.html`; Template-Layouts verwenden, wo passend, Tailwind-CSS-Utilities.

## Farben und Überschneidungen

Die sieben unterscheidbaren Farbpaare basieren auf Tailwind-Farben: Teal, Blue, Amber, Violet, Lime, Rose und Orange. Jede Palette verwendet einen dunklen Accent-Ton für Marker und Border sowie den passenden hellen Ton für Ferien-Tage.

Ein Datum bleibt in jedem Ferienart-Grid markiert, zu dem es gehört. Sein zugänglicher Name listet weiterhin alle am Datum liegenden Ferienarten auf. Die Kalenderdaten werden dafür nicht je Grid gefiltert oder verändert.

## Verifikation

Die App-Tests prüfen die Komponentenstruktur, Ferienüberschneidungen, Kalenderzellen, Titel- und Datumsbereichsstruktur, Farbpaare, Toolbar und Dialogabläufe. Die vorgeschriebenen Projektprüfungen sind `npm run build` und `npm test -- --watch=false`.

## Prüfergebnis

- `npm run build`: erfolgreich ohne Budgetwarnung. Die Budgets liegen bei 1 MB/4 MB für das Initial-Bundle und 10 kB/16 kB für einzelne Komponenten-Styles.
- `npm test -- --watch=false`: erfolgreich, 3 Testdateien und 43 Tests bestanden.