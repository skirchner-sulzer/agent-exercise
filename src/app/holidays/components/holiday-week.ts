import { Component, input } from '@angular/core';
import { CalendarWeekView } from '../calendar.utils';

@Component({
  selector: 'app-holiday-week',
  host: { class: 'block' },
  template: `
    <div class="week-row grid grid-cols-[2.3rem_repeat(7,minmax(0,1fr))] items-center gap-[.15rem] p-1 max-[480px]:grid-cols-[1.8rem_repeat(7,minmax(0,1fr))] max-[480px]:gap-[.05rem]"
      [class.border-t]="!first()" [class.border-[#f0f3f3]]="!first()" role="row">
      <span class="week-number grid h-10 min-w-0 place-items-center text-[.68rem] tabular-nums text-[#52666d] max-[480px]:h-9 max-[480px]:text-[.7rem]" role="rowheader">{{ week().weekNumber }}</span>
      @for (day of week().days; track day.date) {
        <span class="day-cell relative grid h-10 min-w-0 place-items-center rounded text-[.76rem] tabular-nums text-[#172d36] max-[480px]:h-9 max-[480px]:text-[.7rem]"
          [class.text-[#a0adaf]]="!day.inSelectedYear" [class.holiday-day]="day.isHoliday" [class.font-bold]="day.isHoliday"
          [class]="day.isHoliday ? lightAccentClass() : ''" role="gridcell" [attr.aria-label]="day.accessibleLabel">
          <span>{{ day.dayOfMonth }}</span>
          @if (day.isHoliday) {
            <span class="holiday-dot absolute bottom-[.22rem] size-[.26rem] rounded-full" [class]="accentClass()" aria-hidden="true"></span>
          }
        </span>
      }
    </div>
  `,
})
export class HolidayWeek {
  readonly week = input.required<CalendarWeekView>();
  readonly first = input.required<boolean>();
  readonly accentClass = input.required<string>();
  readonly lightAccentClass = input.required<string>();
}