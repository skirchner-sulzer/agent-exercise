import { afterNextRender, Component, computed, inject, Injector, OnInit, signal } from '@angular/core';
import { HolidaySection, buildHolidaySections } from './holidays/calendar.utils';
import { HolidayStore } from './holidays/holiday.store';
import { HOLIDAY_API_URL, STATES, SUPPORTED_YEARS } from './holidays/holiday.model';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell min-h-screen bg-[#f7f8f6] text-[#172d36]">
      <header class="border-b border-[#dce4e4] bg-white/90">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a class="brand-mark" href="/" aria-label="Schulferienkalender Startseite">
            <span class="brand-icon" aria-hidden="true">F</span>
            <span>Ferienatlas</span>
          </a>
          <button class="selection-button" type="button" aria-label="Jahr und Bundesland auswählen" aria-haspopup="dialog" (click)="openSelection()">
            <span>{{ store.year() }} · {{ stateName() }}</span>
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-5 pb-36 pt-8 sm:px-8 sm:pt-12">
        <section class="intro-band" aria-labelledby="page-title">
          <div>
            <p class="eyebrow">Ferienübersicht · {{ stateName() }}</p>
            <h1 id="page-title">Schulferien <span>{{ store.year() }}</span></h1>
            <p class="intro-copy">Die Ferienzeiten im Jahreslauf, Woche für Woche.</p>
          </div>
          <div class="year-stamp" aria-hidden="true">
            <span>{{ store.year() }}</span>
            <small>DE · {{ store.stateCode() }}</small>
          </div>
        </section>

        @if (store.loading()) {
          <p class="status-message" role="status">Ferien werden geladen …</p>
        } @else if (store.error()) {
          <p class="status-message" role="alert">{{ store.error() }}</p>
        } @else if (store.holidays().length === 0) {
          <section class="empty-state" role="status">
            <h2>Keine gespeicherten Ferienzeiten</h2>
            <p>Online werden die Daten beim nächsten Laden abgerufen. Offline sind bisher keine Daten für diese Auswahl gespeichert.</p>
          </section>
        } @else if (visibleSections().length === 0) {
          <section class="empty-state" role="status">
            <h2>Keine Ferienarten ausgewählt</h2>
            <p>Öffne den Filter, um Kalenderbereiche einzublenden.</p>
          </section>
        } @else {
          <div class="calendar-sections" aria-label="Ferienkalender nach Ferienart">
            @for (section of visibleSections(); track section.type; let index = $index) {
              <section class="holiday-section" [attr.data-holiday-type]="section.type" [style.--holiday-color]="holidayColor(index)">
                <header class="section-heading grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 mb-3">
                  <span class="size-[.65rem] rounded-full bg-[var(--holiday-color)]" aria-hidden="true"></span>
                  <h2 class="m-0 min-w-0 text-base font-bold">{{ section.label }}</h2>
                  <p class="section-date-range m-0 justify-self-end whitespace-nowrap text-right text-[.72rem] tabular-nums text-[#61747a]">{{ section.dateRange }}</p>
                </header>
                <div class="week-grid" role="grid" [attr.aria-label]="section.label + ' Kalenderwochen'">
                  <div class="week-heading" role="row">
                    <span role="columnheader">KW</span>
                    @for (weekday of weekdays; track weekday) {
                      <span role="columnheader">{{ weekday }}</span>
                    }
                  </div>
                  @for (week of section.weeks; track week.startDate) {
                    <div class="week-row" role="row">
                      <span class="week-number" role="rowheader">{{ week.weekNumber }}</span>
                      @for (day of week.days; track day.date) {
                        <span class="day-cell" role="gridcell" [class.outside-year]="!day.inSelectedYear"
                          [class.holiday-day]="hasSectionHoliday(section, day.holidays)"
                          [attr.aria-label]="dayLabel(day.date, day.dayOfMonth, day.holidays)">
                          <span>{{ day.dayOfMonth }}</span>
                          @if (hasSectionHoliday(section, day.holidays)) {
                            <span class="holiday-dot" aria-hidden="true"></span>
                          }
                        </span>
                      }
                    </div>
                  }
                </div>
              </section>
            }
          </div>
        }
      </main>

      <nav class="bottom-toolbar" aria-label="Kalenderaktionen">
        <button type="button" aria-label="Ferien neu laden" (click)="store.reload()" [disabled]="store.loading()"><span aria-hidden="true">↻</span> Aktualisieren</button>
        <button type="button" aria-label="Ferienarten filtern" aria-haspopup="dialog" (click)="openFilter()"><span aria-hidden="true">☷</span> Filter</button>
        <button type="button" aria-label="Über diese Anwendung" aria-haspopup="dialog" (click)="openAbout()"><span aria-hidden="true">ⓘ</span> Info</button>
      </nav>

      @if (selectionOpen()) {
        <div class="dialog-backdrop" (click)="closeDialogs()">
          <section class="dialog-panel" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="selection-title" (click)="$event.stopPropagation()" (keydown)="trapDialogFocus($event)" (keydown.escape)="closeDialogs()">
            <p class="eyebrow">Kalender einstellen</p>
            <h2 id="selection-title">Jahr und Bundesland</h2>
            <label for="year-select">Jahr</label>
            <select id="year-select" aria-label="Jahr" [value]="draftYear()" (change)="draftYear.set(+$any($event.target).value)">
              @for (year of years; track year) { <option [value]="year" [selected]="year === draftYear()">{{ year }}</option> }
            </select>
            <label for="state-select">Bundesland</label>
            <select id="state-select" aria-label="Bundesland" [value]="draftState()" (change)="draftState.set($any($event.target).value)">
              @for (state of states; track state.code) { <option [value]="state.code" [selected]="state.code === draftState()">{{ state.name }}</option> }
            </select>
            <div class="dialog-actions">
              <button type="button" class="quiet-button" (click)="closeDialogs()">Abbrechen</button>
              <button type="button" data-action="apply-selection" class="primary-button" (click)="applySelection()">Übernehmen</button>
            </div>
          </section>
        </div>
      }

      @if (filterOpen()) {
        <div class="dialog-backdrop" (click)="closeDialogs()">
          <section class="dialog-panel filter-panel" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="filter-title" (click)="$event.stopPropagation()" (keydown)="trapDialogFocus($event)" (keydown.escape)="closeDialogs()">
            <p class="eyebrow">Anzeige</p>
            <h2 id="filter-title">Ferienarten</h2>
            <div class="type-list">
              @for (section of allSections(); track section.type; let index = $index) {
                <label class="type-option">
                  <input type="checkbox" [attr.aria-label]="section.label" [checked]="isTypeSelected(section.type)" (change)="toggleType(section.type)" />
                  <span class="section-marker" [style.--holiday-color]="holidayColor(index)" aria-hidden="true"></span>
                  <span>{{ section.label }}</span>
                </label>
              }
            </div>
            <div class="filter-actions">
              <button type="button" data-action="select-all-types" class="quiet-button" (click)="selectAllTypes()">Alles auswählen</button>
              <button type="button" data-action="invert-types" class="quiet-button" (click)="invertTypes()">Auswahl umkehren</button>
            </div>
            <div class="dialog-actions"><button type="button" class="primary-button" (click)="closeDialogs()">Fertig</button></div>
          </section>
        </div>
      }

      @if (aboutOpen()) {
        <div class="dialog-backdrop" (click)="closeDialogs()">
          <section class="dialog-panel about-panel" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="about-title" (click)="$event.stopPropagation()" (keydown)="trapDialogFocus($event)" (keydown.escape)="closeDialogs()">
            <p class="eyebrow">Über diese Anwendung</p>
            <h2 id="about-title">Schulferienkalender</h2>
            <dl>
              <dt>Version</dt><dd>0.0.0</dd>
              <dt>Repository</dt><dd><a href="https://github.com/skirchner-sulzer/agent-exercise" target="_blank" rel="noreferrer">github.com/skirchner-sulzer/agent-exercise</a></dd>
              <dt>DataProvider</dt><dd><a [href]="providerUrl" target="_blank" rel="noreferrer">schulferien-api.de</a></dd>
            </dl>
            <h3>PWA installieren</h3>
            <p>In Chrome oder Edge über das Installationssymbol in der Adressleiste oder das Browsermenü installieren. Auf iPhone und iPad im Teilen-Menü „Zum Home-Bildschirm“ wählen.</p>
            <div class="dialog-actions"><button type="button" class="primary-button" (click)="closeDialogs()">Schließen</button></div>
          </section>
        </div>
      }
    </div>
  `,
})
export class App implements OnInit {
  protected readonly store = inject(HolidayStore);
  protected readonly years = SUPPORTED_YEARS;
  protected readonly states = STATES;
  protected readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  protected readonly providerUrl = `${HOLIDAY_API_URL}/`;
  protected readonly selectionOpen = signal(false);
  protected readonly filterOpen = signal(false);
  protected readonly aboutOpen = signal(false);
  protected readonly draftYear = signal(new Date().getFullYear());
  protected readonly draftState = signal('BY');
  private readonly injector = inject(Injector);
  private dialogTrigger: HTMLElement | null = null;
  private readonly selectedTypes = signal<Set<string> | null>(null);
  protected readonly allSections = computed(() => buildHolidaySections(this.store.year(), this.store.holidays()));
  protected readonly visibleSections = computed(() => {
    const selected = this.selectedTypes();
    return selected ? this.allSections().filter((section) => selected.has(section.type)) : this.allSections();
  });

  ngOnInit(): void {
    this.store.load();
  }

  protected stateName(): string {
    return STATES.find((state) => state.code === this.store.stateCode())?.name ?? this.store.stateCode();
  }

  protected openSelection(): void {
    this.rememberDialogTrigger();
    this.draftYear.set(this.store.year());
    this.draftState.set(this.store.stateCode());
    this.selectionOpen.set(true);
    this.focusDialog();
  }

  protected openFilter(): void {
    this.rememberDialogTrigger();
    this.filterOpen.set(true);
    this.focusDialog();
  }

  protected openAbout(): void {
    this.rememberDialogTrigger();
    this.aboutOpen.set(true);
    this.focusDialog();
  }

  protected applySelection(): void {
    this.store.select(this.draftYear(), this.draftState());
    this.selectedTypes.set(null);
    this.closeDialogs();
  }

  protected closeDialogs(): void {
    this.selectionOpen.set(false);
    this.filterOpen.set(false);
    this.aboutOpen.set(false);
    const trigger = this.dialogTrigger;
    this.dialogTrigger = null;
    afterNextRender(() => trigger?.focus(), { injector: this.injector });
  }

  protected trapDialogFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const dialog = event.currentTarget as HTMLElement;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled)',
    ));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private rememberDialogTrigger(): void {
    this.dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  private focusDialog(): void {
    afterNextRender(() => {
      const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
      const target = dialog?.querySelector<HTMLElement>('select, input, button, a[href]') ?? dialog;
      target?.focus();
    }, { injector: this.injector });
  }

  protected hasSectionHoliday(section: HolidaySection, holidays: { type: string }[]): boolean {
    return holidays.some((holiday) => holiday.type === section.type);
  }

  protected dayLabel(date: string, day: number, holidays: { label: string }[]): string {
    const names = holidays.map((holiday) => holiday.label).join(', ');
    return names ? `${date}: ${names}` : `${date}, ${day}`;
  }

  protected holidayColor(index: number): string {
    return ['var(--primary)', 'var(--accent)', 'oklch(72% 0.16 55)', 'oklch(66% 0.12 300)', 'oklch(72% 0.13 105)', 'var(--secondary)', 'oklch(68% 0.14 25)'][index % 7];
  }

  protected isTypeSelected(type: string): boolean {
    return this.selectedTypes()?.has(type) ?? true;
  }

  protected toggleType(type: string): void {
    const selected = new Set(this.selectedTypes() ?? this.allSections().map((section) => section.type));
    selected.has(type) ? selected.delete(type) : selected.add(type);
    this.selectedTypes.set(selected);
  }

  protected selectAllTypes(): void {
    this.selectedTypes.set(null);
  }

  protected invertTypes(): void {
    const selected = this.selectedTypes() ?? new Set(this.allSections().map((section) => section.type));
    this.selectedTypes.set(new Set(this.allSections().map((section) => section.type).filter((type) => !selected.has(type))));
  }
}
