import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { HolidayDataService } from './holiday-data.service';
import { Holiday, STATES, SUPPORTED_YEARS } from './holiday.model';

interface HolidayState {
  year: number;
  stateCode: string;
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
}

export const HolidayStore = signalStore(
  { providedIn: 'root' },
  withState<HolidayState>({
    year: new Date().getFullYear(),
    stateCode: 'BY',
    holidays: [],
    loading: false,
    error: null,
  }),
  withMethods((store, dataService = inject(HolidayDataService)) => {
    let activeRequest = 0;
    const fetchHolidays = (year: number, stateCode: string) => {
      const requestId = ++activeRequest;
      patchState(store, { year, stateCode, loading: true, error: null });
      dataService.load(year, stateCode).subscribe({
        next: (holidays) => {
          if (requestId === activeRequest) {
            patchState(store, { holidays, loading: false });
          }
        },
        error: () => {
          if (requestId === activeRequest) {
            patchState(store, { holidays: [], loading: false, error: 'Ferien konnten nicht geladen werden.' });
          }
        },
      });
    };

    return {
      load: () => fetchHolidays(store.year(), store.stateCode()),
      reload: () => fetchHolidays(store.year(), store.stateCode()),
      select: (year: number, stateCode: string) => {
        if (
          !SUPPORTED_YEARS.includes(year as (typeof SUPPORTED_YEARS)[number]) ||
          !STATES.some((state) => state.code === stateCode)
        ) {
          return;
        }
        fetchHolidays(year, stateCode);
      },
    };
  }),
);