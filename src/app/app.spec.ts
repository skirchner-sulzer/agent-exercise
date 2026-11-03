import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { HolidayDataService } from './holidays/holiday-data.service';
import { Holiday } from './holidays/holiday.model';
import { HolidayStore } from './holidays/holiday.store';

describe('App', () => {
  let dataService: { load: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dataService = {
      load: vi.fn(() => of([
        { type: 'winterferien', label: 'Winterferien', startDate: '2026-02-16', endDate: '2026-02-20', year: 2026, stateCode: 'BY', slug: 'winterferien-2026-BY', id: 'winterferien-1' },
        { type: 'osterferien', label: 'Osterferien', startDate: '2026-03-30', endDate: '2026-04-10', year: 2026, stateCode: 'BY', slug: 'osterferien-2026-BY', id: 'osterferien-1' },
      ] as Holiday[])),
    };
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: HolidayDataService, useValue: dataService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('shows the current year and Bavaria as the active selection', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    expect(compiled.querySelector('[aria-label="Jahr und Bundesland auswählen"]')?.textContent).toContain(
      `${new Date().getFullYear()} · Bayern`,
    );
    expect(dataService.load).toHaveBeenCalledWith(new Date().getFullYear(), 'BY');
  });

  it('opens the selection dialog with the active year and state selected', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('[aria-label="Jahr und Bundesland auswählen"]')!.click();
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLSelectElement>('[aria-label="Jahr"]')?.value).toBe(String(new Date().getFullYear()));
    expect(compiled.querySelector<HTMLSelectElement>('[aria-label="Bundesland"]')?.value).toBe('BY');
  });

  it('opens the selection dialog and updates the year and state', async () => {
    const initialHolidays = [
      { type: 'winterferien', label: 'Winterferien', startDate: '2026-02-16', endDate: '2026-02-20', year: 2026, stateCode: 'BY', slug: 'winterferien-2026-BY', id: 'winterferien-1' },
    ] as Holiday[];
    const selectedHolidays = [
      { type: 'herbstferien', label: 'Herbstferien', startDate: '2027-10-11', endDate: '2027-10-23', year: 2027, stateCode: 'NW', slug: 'herbstferien-2027-NW', id: 'herbstferien-1' },
    ] as Holiday[];
    dataService.load.mockReturnValueOnce(of(initialHolidays)).mockReturnValueOnce(of(selectedHolidays));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    expect(compiled.querySelector('[data-holiday-type="winterferien"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label^="2026-02-16"]')?.classList.contains('holiday-day')).toBe(true);

    compiled.querySelector<HTMLButtonElement>('[aria-label="Jahr und Bundesland auswählen"]')?.click();
    fixture.detectChanges();
    const year = compiled.querySelector<HTMLSelectElement>('[aria-label="Jahr"]')!;
    const state = compiled.querySelector<HTMLSelectElement>('[aria-label="Bundesland"]')!;
    year.value = '2027';
    year.dispatchEvent(new Event('change'));
    state.value = 'NW';
    state.dispatchEvent(new Event('change'));
    compiled.querySelector<HTMLButtonElement>('[data-action="apply-selection"]')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('[aria-label="Jahr und Bundesland auswählen"]')?.textContent).toContain('2027 · Nordrhein-Westfalen');
    expect(dataService.load).toHaveBeenLastCalledWith(2027, 'NW');
    expect(compiled.querySelector('[data-holiday-type="winterferien"]')).toBeNull();
    expect(compiled.querySelector('[aria-label^="2026-02-16"]')).toBeNull();
    const selectedSection = compiled.querySelector('[data-holiday-type="herbstferien"]');
    expect(selectedSection).toBeTruthy();
    expect(selectedSection?.querySelector('[aria-label^="2027-10-11"]')?.classList.contains('holiday-day')).toBe(true);
  });

  it('moves keyboard focus into the selection dialog and restores it on Escape', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    const trigger = compiled.querySelector<HTMLButtonElement>('[aria-label="Jahr und Bundesland auswählen"]')!;
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const yearSelect = compiled.querySelector<HTMLSelectElement>('[aria-label="Jahr"]')!;
    expect(document.activeElement).toBe(yearSelect);
    yearSelect.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('only offers years and states supported by the provider', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('[aria-label="Jahr und Bundesland auswählen"]')?.click();
    fixture.detectChanges();

    const yearOptions = Array.from(compiled.querySelectorAll<HTMLSelectElement>('[aria-label="Jahr"] option'))
      .map((option) => option.value);
    const stateOptions = Array.from(compiled.querySelectorAll<HTMLSelectElement>('[aria-label="Bundesland"] option'))
      .map((option) => option.value);

    expect(yearOptions).toEqual(['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029']);
    expect(stateOptions).toEqual(['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH']);
    expect(yearOptions).not.toContain('2030');
    expect(stateOptions).not.toContain('XX');
  });

  it('filters holiday sections and supports invert selection', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    const initialOsterColor = compiled.querySelector<HTMLElement>('[data-holiday-type="osterferien"]')?.dataset['accentColor'];

    compiled.querySelector<HTMLButtonElement>('[aria-label="Ferienarten filtern"]')?.click();
    fixture.detectChanges();
    const winter = compiled.querySelector<HTMLInputElement>('[aria-label="Winterferien"]')!;
    winter.checked = false;
    winter.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('[data-holiday-type]')).toHaveLength(1);
    expect(compiled.querySelector('[data-holiday-type="osterferien"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLElement>('[data-holiday-type="osterferien"]')?.dataset['accentColor']).toBe(initialOsterColor);
    compiled.querySelector<HTMLButtonElement>('[data-action="invert-types"]')?.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('[data-holiday-type]')).toHaveLength(1);
    expect(compiled.querySelector('[data-holiday-type="winterferien"]')).toBeTruthy();
    compiled.querySelector<HTMLButtonElement>('[data-action="select-all-types"]')?.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('[data-holiday-type]')).toHaveLength(2);
  });

  it('renders seven days in each calendar week and marks the actual holiday dates', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const winterSection = compiled.querySelector('[data-holiday-type="winterferien"]')!;
    const weekRows = Array.from(winterSection.querySelectorAll<HTMLElement>('[role="row"]'))
      .filter((row) => row.querySelector('[role="rowheader"]'));

    expect(weekRows.length).toBeGreaterThan(0);
    expect(weekRows.every((row) => row.querySelectorAll('[role="gridcell"]').length === 7)).toBe(true);
    expect(winterSection.querySelector('[aria-label^="2026-02-16"]')?.classList.contains('holiday-day')).toBe(true);
    expect(winterSection.querySelector('[aria-label^="2026-02-20"]')?.classList.contains('holiday-day')).toBe(true);
    expect(winterSection.querySelector('[aria-label^="2026-02-21"]')?.classList.contains('holiday-day')).toBe(false);
  });

  it('renders each holiday section through the requested components and preserves overlapping holidays', async () => {
    dataService.load.mockReturnValueOnce(of([
      { type: 'winterferien', label: 'Winterferien', startDate: '2026-02-16', endDate: '2026-02-20', year: 2026, stateCode: 'BY', slug: 'winterferien-1', id: 'winterferien-1' },
      { type: 'faschingsferien', label: 'Faschingsferien', startDate: '2026-02-18', endDate: '2026-02-20', year: 2026, stateCode: 'BY', slug: 'faschingsferien-1', id: 'faschingsferien-1' },
    ] as Holiday[]));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = Array.from(compiled.querySelectorAll<HTMLElement>('[data-holiday-type]'));

    expect(sections).toHaveLength(2);
    for (const section of sections) {
      expect(section.querySelector('app-holiday-title h2')?.textContent?.trim()).toBeTruthy();
      expect(section.querySelector('app-holiday-border')).toBeTruthy();
      expect(section.querySelector('[role="grid"] [role="columnheader"]')?.textContent).toBe('KW');
      expect(section.querySelectorAll('app-holiday-week [role="gridcell"]')).not.toHaveLength(0);
      expect(Array.from(section.querySelectorAll('app-holiday-week')).every((week) => week.querySelectorAll('[role="row"]').length === 1)).toBe(true);
      const overlapDay = section.querySelector<HTMLElement>('[aria-label^="2026-02-19"]')!;
      expect(overlapDay.classList.contains('holiday-day')).toBe(true);
      expect(overlapDay.classList.contains(section.dataset['lightAccentColor']!)).toBe(true);
      expect(section.querySelector('app-holiday-border div')?.classList.contains(`border-${section.dataset['accentColor']}-700`)).toBe(true);
      expect(overlapDay.getAttribute('aria-label'))
        .toContain('Winterferien, Faschingsferien');
    }
  });

  it('keeps the toolbar fixed above content and gives it a glow utility', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const toolbar = (fixture.nativeElement as HTMLElement).querySelector('app-toolbar nav')!;

    expect(toolbar.classList.contains('fixed')).toBe(true);
    expect(toolbar.className).toContain('shadow-');
  });

  it('renders the holiday span on the right of its heading without a week count', async () => {
    dataService.load.mockReturnValueOnce(of([
      { type: 'sommerferien', label: 'Sommerferien', startDate: '2026-07-01', endDate: '2026-07-03', year: 2026, stateCode: 'BY', slug: 'sommerferien-1', id: 'sommerferien-1' },
      { type: 'sommerferien', label: 'Sommerferien', startDate: '2026-07-10', endDate: '2026-07-12', year: 2026, stateCode: 'BY', slug: 'sommerferien-2', id: 'sommerferien-2' },
    ] as Holiday[]));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('[data-holiday-type="sommerferien"]')!;
    const header = section.querySelector<HTMLElement>('.section-heading')!;
    const dateRange = header.querySelector<HTMLElement>('.section-date-range')!;
    const heading = header.querySelector<HTMLElement>('h2')!;

    expect(Array.from(header.children).map((element) => element.tagName)).toEqual(['SPAN', 'H2', 'P']);
    expect(header.children[0].classList.contains('rounded-full')).toBe(true);
    expect(heading.textContent).toBe('Sommerferien');
    expect(dateRange.textContent?.trim()).toBe('01.07.–12.07.2026');
    expect(header.classList.contains('section-heading')).toBe(true);
    expect(header.classList.contains('grid')).toBe(true);
    expect(header.classList.contains('grid-cols-[auto_minmax(0,1fr)_auto]')).toBe(true);
    expect(header.classList.contains('items-center')).toBe(true);
    expect(dateRange.classList.contains('section-date-range')).toBe(true);
    expect(dateRange.classList.contains('justify-self-end')).toBe(true);
    expect(dateRange.classList.contains('text-[.72rem]')).toBe(true);
    expect(section.querySelector('.section-count')).toBeNull();
    expect(section.textContent).not.toContain('Wochen');
  });

  it('uses distinct colors for all displayed holiday types', async () => {
    const palettes = [
      { type: 'winterferien', accent: 'teal', marker: 'bg-teal-700', border: 'border-teal-700', light: 'bg-teal-100' },
      { type: 'osterferien', accent: 'blue', marker: 'bg-blue-700', border: 'border-blue-700', light: 'bg-blue-100' },
      { type: 'pfingstferien', accent: 'amber', marker: 'bg-amber-700', border: 'border-amber-700', light: 'bg-amber-100' },
      { type: 'sommerferien', accent: 'violet', marker: 'bg-violet-700', border: 'border-violet-700', light: 'bg-violet-100' },
      { type: 'herbstferien', accent: 'lime', marker: 'bg-lime-700', border: 'border-lime-700', light: 'bg-lime-100' },
      { type: 'weihnachtsferien', accent: 'rose', marker: 'bg-rose-700', border: 'border-rose-700', light: 'bg-rose-100' },
      { type: 'faschingsferien', accent: 'orange', marker: 'bg-orange-700', border: 'border-orange-700', light: 'bg-orange-100' },
    ];
    dataService.load.mockReturnValueOnce(of(palettes.map(({ type }, index) => {
      const day = String(index + 1).padStart(2, '0');
      return {
        type,
        label: type,
        startDate: `2026-06-${day}`,
        endDate: `2026-06-${day}`,
        year: 2026,
        stateCode: 'BY',
        slug: `${type}-2026-BY`,
        id: `${type}-2026-BY`,
      };
    }) as Holiday[]));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = Array.from(compiled.querySelectorAll<HTMLElement>('[data-holiday-type]'));

    expect(sections).toHaveLength(7);
    expect(sections.map((section) => section.dataset['holidayType'])).toEqual(palettes.map(({ type }) => type));
    for (const [index, section] of sections.entries()) {
      const palette = palettes[index];
      const holidayDay = section.querySelector<HTMLElement>('.holiday-day')!;
      const weekdayHeaders = Array.from(section.querySelectorAll('[role="grid"] [role="columnheader"]'))
        .slice(1)
        .map((header) => header.textContent?.trim());

      expect(section.dataset['accentColor']).toBe(palette.accent);
      expect(section.querySelector('app-holiday-title span')?.classList.contains(palette.marker)).toBe(true);
      expect(section.querySelector('app-holiday-border div')?.classList.contains(palette.border)).toBe(true);
      expect(holidayDay.classList.contains(palette.light)).toBe(true);
      expect(weekdayHeaders).toEqual(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
    }
  });

  it('renders exactly one filter checkbox for every displayed holiday type', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const displayedTypes = Array.from(compiled.querySelectorAll<HTMLElement>('[data-holiday-type]'))
      .map((section) => section.querySelector('h2')?.textContent?.trim());

    compiled.querySelector<HTMLButtonElement>('[aria-label="Ferienarten filtern"]')?.click();
    fixture.detectChanges();
    const checkboxes = Array.from(compiled.querySelectorAll<HTMLInputElement>('.type-list input[type="checkbox"]'));

    expect(checkboxes.map((checkbox) => checkbox.getAttribute('aria-label'))).toEqual(displayedTypes);
    expect(new Set(checkboxes.map((checkbox) => checkbox.getAttribute('aria-label'))).size).toBe(displayedTypes.length);
  });

  it.each([
    ['filter', '[aria-label="Ferienarten filtern"]', '[aria-labelledby="filter-title"]'],
    ['about', '[aria-label="Über diese Anwendung"]', '[aria-labelledby="about-title"]'],
  ])('moves focus into the %s dialog and restores it on Escape', async (_name, triggerSelector, dialogSelector) => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector<HTMLButtonElement>(triggerSelector)!;
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = compiled.querySelector<HTMLElement>(dialogSelector)!;
    expect(document.activeElement).not.toBe(trigger);
    expect(dialog.contains(document.activeElement)).toBe(true);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector(dialogSelector)).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it.each([
    ['selection', '[aria-label="Jahr und Bundesland auswählen"]', '[aria-labelledby="selection-title"]'],
    ['filter', '[aria-label="Ferienarten filtern"]', '[aria-labelledby="filter-title"]'],
    ['about', '[aria-label="Über diese Anwendung"]', '[aria-labelledby="about-title"]'],
  ])('wraps Tab focus at both ends of the %s dialog', async (_name, triggerSelector, dialogSelector) => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>(triggerSelector)!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = compiled.querySelector<HTMLElement>(dialogSelector)!;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled)',
    ));
    const first = focusable[0];
    const last = focusable.at(-1)!;
    first.focus();
    const shiftTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    first.dispatchEvent(shiftTab);

    expect(shiftTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);

    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    last.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('updates the calendar and store state after an online reload', async () => {
    const initialHolidays = [
      { type: 'winterferien', label: 'Winterferien', startDate: '2026-02-16', endDate: '2026-02-20', year: 2026, stateCode: 'BY', slug: 'winterferien-2026-BY', id: 'winterferien-1' },
    ] as Holiday[];
    const refreshedHolidays = [
      { type: 'sommerferien', label: 'Sommerferien', startDate: '2026-07-06', endDate: '2026-07-17', year: 2026, stateCode: 'BY', slug: 'sommerferien-2026-BY', id: 'sommerferien-1' },
    ] as Holiday[];
    dataService.load.mockReturnValueOnce(of(initialHolidays)).mockReturnValueOnce(of(refreshedHolidays));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-holiday-type="winterferien"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label^="2026-02-16"]')?.classList.contains('holiday-day')).toBe(true);

    compiled.querySelector<HTMLButtonElement>('[aria-label="Ferien neu laden"]')!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-holiday-type="winterferien"]')).toBeNull();
    expect(compiled.querySelector('[data-holiday-type="sommerferien"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label^="2026-07-06"]')?.classList.contains('holiday-day')).toBe(true);
    expect(fixture.debugElement.injector.get(HolidayStore).holidays()).toEqual(refreshedHolidays);
    expect(dataService.load).toHaveBeenCalledTimes(2);
  });

  it('reloads data and exposes accessible About metadata', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('[aria-label="Ferien neu laden"]')?.click();
    expect(dataService.load).toHaveBeenCalledTimes(2);
    compiled.querySelector<HTMLButtonElement>('[aria-label="Über diese Anwendung"]')?.click();
    fixture.detectChanges();

    const about = compiled.querySelector('[role="dialog"][aria-labelledby="about-title"]');
    expect(about?.textContent).toContain('Schulferienkalender');
    expect(about?.textContent).toContain('0.0.0');
    expect(about?.querySelector('a[href="https://github.com/skirchner-sulzer/agent-exercise"]')).toBeTruthy();
    expect(about?.querySelector('a[href="https://schulferien-api.de/"]')).toBeTruthy();
    expect(about?.textContent).toContain('Zum Home-Bildschirm');
  });

  it('shows an explicit empty state when no cached or remote holidays exist', async () => {
    dataService.load.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[role="status"]')?.textContent).toContain('Keine gespeicherten Ferienzeiten');
    expect(compiled.querySelector('[role="grid"]')).toBeNull();
  });
});
