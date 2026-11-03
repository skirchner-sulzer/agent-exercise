import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  template: `
    <nav class="bottom-toolbar fixed bottom-0 left-1/2 z-10 flex w-[min(calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-2rem),32rem)] -translate-x-1/2 justify-around gap-[.4rem] rounded-t-[.8rem] border border-b-0 border-[#d4dfdf] bg-white/[.96] px-[.65rem] pt-[.55rem] pb-[calc(.55rem+env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(23,45,54,0.08),0_0_18px_rgba(20,130,148,0.14)] max-[480px]:gap-1" aria-label="Kalenderaktionen">
      <button class="flex min-h-11 flex-1 items-center justify-center gap-[.45rem] rounded-[.45rem] bg-transparent px-3 py-[.4rem] text-[.85rem] font-semibold text-[#294852] hover:bg-[#edf4f2] disabled:cursor-wait disabled:opacity-55 max-[480px]:gap-1 max-[480px]:px-[.2rem] max-[480px]:text-[.75rem]" type="button" aria-label="Ferien neu laden" (click)="reload.emit()" [disabled]="loading()"><span class="text-[1.1rem] text-sky-700" aria-hidden="true">↻</span> Aktualisieren</button>
      <button class="flex min-h-11 flex-1 items-center justify-center gap-[.45rem] rounded-[.45rem] bg-transparent px-3 py-[.4rem] text-[.85rem] font-semibold text-[#294852] hover:bg-[#edf4f2] max-[480px]:gap-1 max-[480px]:px-[.2rem] max-[480px]:text-[.75rem]" type="button" aria-label="Ferienarten filtern" aria-haspopup="dialog" (click)="filter.emit()"><span class="text-[1.1rem] text-sky-700" aria-hidden="true">☷</span> Filter</button>
      <button class="flex min-h-11 flex-1 items-center justify-center gap-[.45rem] rounded-[.45rem] bg-transparent px-3 py-[.4rem] text-[.85rem] font-semibold text-[#294852] hover:bg-[#edf4f2] max-[480px]:gap-1 max-[480px]:px-[.2rem] max-[480px]:text-[.75rem]" type="button" aria-label="Über diese Anwendung" aria-haspopup="dialog" (click)="about.emit()"><span class="text-[1.1rem] text-sky-700" aria-hidden="true">ⓘ</span> Info</button>
    </nav>
  `,
})
export class Toolbar {
  readonly loading = input(false);
  readonly reload = output<void>();
  readonly filter = output<void>();
  readonly about = output<void>();
}