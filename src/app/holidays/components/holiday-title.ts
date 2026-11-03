import { Component, input } from '@angular/core';

@Component({
  selector: 'app-holiday-title',
  host: { class: 'block' },
  template: `
    <header class="section-heading mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
      <span class="size-[.65rem] rounded-full" [class]="accentClass()" aria-hidden="true"></span>
      <h2 class="m-0 min-w-0 text-base font-bold">{{ label() }}</h2>
      <p class="section-date-range m-0 justify-self-end whitespace-nowrap text-right text-[.72rem] tabular-nums text-[#61747a]">{{ dateRange() }}</p>
    </header>
  `,
})
export class HolidayTitle {
  readonly label = input.required<string>();
  readonly dateRange = input.required<string>();
  readonly accentClass = input.required<string>();
}