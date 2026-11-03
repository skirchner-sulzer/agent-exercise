import { Component, input } from '@angular/core';

@Component({
  selector: 'app-holiday-border',
  host: { class: 'block' },
  template: '<div class="border-t-2 pt-3" [class]="accentClass()" aria-hidden="true"></div>',
})
export class HolidayBorder {
  readonly accentClass = input.required<string>();
}