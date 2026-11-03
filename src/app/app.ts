import { afterNextRender, Component, computed, inject, Injector, OnInit, signal } from '@angular/core';
import { HolidayGrid, HOLIDAY_COLOR_PALETTES, HolidayColorPalette } from './holidays/components/holiday-grid';
import { Toolbar } from './holidays/components/toolbar';
import { buildHolidaySections, HolidaySectionView } from './holidays/calendar.utils';
import { HolidayStore } from './holidays/holiday.store';
import { HOLIDAY_API_URL, STATES, SUPPORTED_YEARS } from './holidays/holiday.model';

@Component({
  selector: 'app-root',
  imports: [HolidayGrid, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly store = inject(HolidayStore);
  protected readonly years = SUPPORTED_YEARS;
  protected readonly states = STATES;
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
  protected readonly visibleSections = computed<HolidaySectionView[]>(() => {
    const selected = this.selectedTypes();
    const sections = selected ? this.allSections().filter((section) => selected.has(section.type)) : this.allSections();

    return sections.map((section) => ({
      ...section,
      weeks: section.weeks.map((week) => ({
        ...week,
        days: week.days.map((day) => {
          const holidayNames = day.holidays.map((holiday) => holiday.label).join(', ');
          return {
            date: day.date,
            dayOfMonth: day.dayOfMonth,
            inSelectedYear: day.inSelectedYear,
            isHoliday: day.holidays.some((holiday) => holiday.type === section.type),
            accessibleLabel: holidayNames ? `${day.date}: ${holidayNames}` : `${day.date}, ${day.dayOfMonth}`,
          };
        }),
      })),
    }));
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

  protected holidayPalette(type: string): HolidayColorPalette {
    const index = this.allSections().findIndex((section) => section.type === type);
    return HOLIDAY_COLOR_PALETTES[index % HOLIDAY_COLOR_PALETTES.length];
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
