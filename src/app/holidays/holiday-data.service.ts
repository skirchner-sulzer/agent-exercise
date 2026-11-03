import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { HOLIDAY_API_URL, Holiday, normalizeHolidayResponse, STATES, SUPPORTED_YEARS } from './holiday.model';

@Injectable({ providedIn: 'root' })
export class HolidayDataService {
  private readonly http = inject(HttpClient);
  private readonly cachePrefix = 'school-holidays:v2:';

  load(year: number, stateCode: string) {
    if (!SUPPORTED_YEARS.includes(year as (typeof SUPPORTED_YEARS)[number]) || !STATES.some((state) => state.code === stateCode)) {
      return of([] as Holiday[]);
    }

    if (!this.isOnline()) {
      return of(this.readCache(year, stateCode));
    }

    return this.http
      .get<unknown>(`${HOLIDAY_API_URL}/api/v2/${year}?states=${encodeURIComponent(stateCode)}`)
      .pipe(
        map((payload) => {
          const holidays = normalizeHolidayResponse(payload);
          this.writeCache(year, stateCode, payload);
          return holidays;
        }),
        catchError(() => of(this.readCache(year, stateCode))),
      );
  }

  private isOnline(): boolean {
    return typeof navigator === 'undefined' || navigator.onLine;
  }

  private cacheKey(year: number, stateCode: string): string {
    return `${this.cachePrefix}${year}:${stateCode}`;
  }

  private readCache(year: number, stateCode: string): Holiday[] {
    try {
      const payload = localStorage.getItem(this.cacheKey(year, stateCode));
      return payload ? normalizeHolidayResponse(JSON.parse(payload)) : [];
    } catch {
      return [];
    }
  }

  private writeCache(year: number, stateCode: string, payload: unknown): void {
    try {
      localStorage.setItem(this.cacheKey(year, stateCode), JSON.stringify(payload));
    } catch {
      // The app remains usable when browser storage is unavailable or full.
    }
  }
}