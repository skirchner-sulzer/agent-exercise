import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterStore } from './counter.store';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  template: `
    <div class="min-h-screen bg-[#f3f4ed] text-[#202822]">
      <header class="border-b border-[#d7ddd4]">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a class="font-semibold tracking-wide" href="/">Agent Exercise</a>
          <span class="flex items-center gap-2 text-sm text-[#526258]">
            <span class="size-2 rounded-full bg-[#2f8f68]"></span>
            Angular starter
          </span>
        </div>
      </header>

      <main class="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-wide text-[#24765a]">Workspace ready</p>
          <h1 class="mt-3 font-serif text-4xl leading-tight md:text-5xl">A clean place to begin.</h1>
          <p class="mt-4 max-w-xl leading-7 text-[#526258]">
            Routing, offline support, utility styling, and reactive state are ready to build on.
          </p>
        </div>

        <section class="mt-10 max-w-xl border border-[#d7ddd4] bg-white p-6 sm:p-8" aria-labelledby="counter-title">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="counter-title" class="text-lg font-semibold">Signal Store example</h2>
              <p class="mt-1 text-sm text-[#66736a]">A small feature store connected to this view.</p>
            </div>
            <span class="rounded-sm bg-[#e6f2e9] px-2.5 py-1 text-xs font-medium text-[#246b4e]">NgRx</span>
          </div>

          <div class="mt-8 flex items-center justify-between gap-4">
            <output class="min-w-16 font-serif text-5xl tabular-nums" aria-live="polite">{{ counter.count() }}</output>
            <div class="flex items-center gap-2">
              <button
                class="size-11 border border-[#cbd4ca] text-xl transition hover:bg-[#f3f4ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24765a]"
                type="button"
                aria-label="Decrease counter"
                (click)="counter.decrement()"
              >-</button>
              <button
                class="size-11 bg-[#24765a] text-xl text-white transition hover:bg-[#195b45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24765a]"
                type="button"
                aria-label="Increase counter"
                (click)="counter.increment()"
              >+</button>
              <button
                class="ml-2 min-h-11 px-3 text-sm font-medium text-[#526258] underline decoration-[#9bac9e] underline-offset-4 hover:text-[#202822]"
                type="button"
                (click)="counter.reset()"
              >Reset</button>
            </div>
          </div>
        </section>

        <router-outlet />
      </main>
    </div>
  `,
})
export class App {
  protected readonly counter = inject(CounterStore);
}
