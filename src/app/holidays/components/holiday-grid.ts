import { Component, input } from '@angular/core';
import { HolidaySectionView } from '../calendar.utils';
import { HolidayBorder } from './holiday-border';
import { HolidayTitle } from './holiday-title';
import { HolidayWeek } from './holiday-week';

export interface HolidayColorPalette {
  name: string;
  markerClass: string;
  borderClass: string;
  lightAccentClass: string;
}

export const HOLIDAY_COLOR_PALETTES: HolidayColorPalette[] = [
  { name: 'teal', markerClass: 'bg-teal-700', borderClass: 'border-teal-700', lightAccentClass: 'bg-teal-100' },
  { name: 'blue', markerClass: 'bg-blue-700', borderClass: 'border-blue-700', lightAccentClass: 'bg-blue-100' },
  { name: 'amber', markerClass: 'bg-amber-700', borderClass: 'border-amber-700', lightAccentClass: 'bg-amber-100' },
  { name: 'violet', markerClass: 'bg-violet-700', borderClass: 'border-violet-700', lightAccentClass: 'bg-violet-100' },
  { name: 'lime', markerClass: 'bg-lime-700', borderClass: 'border-lime-700', lightAccentClass: 'bg-lime-100' },
  { name: 'rose', markerClass: 'bg-rose-700', borderClass: 'border-rose-700', lightAccentClass: 'bg-rose-100' },
  { name: 'orange', markerClass: 'bg-orange-700', borderClass: 'border-orange-700', lightAccentClass: 'bg-orange-100' },
];

@Component({
  selector: 'app-holiday-grid',
  imports: [HolidayBorder, HolidayTitle, HolidayWeek],
  template: `
    <section class="holiday-section min-w-0" [attr.data-holiday-type]="section().type"
      [attr.data-accent-color]="palette().name" [attr.data-light-accent-color]="palette().lightAccentClass">
      <app-holiday-border [accentClass]="palette().borderClass" />
      <app-holiday-title [label]="section().label" [dateRange]="section().dateRange" [accentClass]="palette().markerClass" />
      <div class="week-grid overflow-hidden rounded border border-[#e0e7e7] bg-white" role="grid" [attr.aria-label]="section().label + ' Kalenderwochen'">
        <div class="week-heading grid grid-cols-[2.3rem_repeat(7,minmax(0,1fr))] items-center gap-[.15rem] border-b border-[#e7ecec] p-1 text-center text-[.68rem] font-bold text-[#61747a] max-[480px]:grid-cols-[1.8rem_repeat(7,minmax(0,1fr))] max-[480px]:gap-[.05rem]" role="row">
          <span role="columnheader">KW</span>
          @for (weekday of weekdays; track weekday) {
            <span role="columnheader">{{ weekday }}</span>
          }
        </div>
        @for (week of section().weeks; track week.startDate; let first = $first) {
          <app-holiday-week [week]="week" [first]="first" [accentClass]="palette().markerClass"
            [lightAccentClass]="palette().lightAccentClass" />
        }
      </div>
    </section>
  `,
})
export class HolidayGrid {
  readonly section = input.required<HolidaySectionView>();
  readonly palette = input.required<HolidayColorPalette>();
  protected readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
}