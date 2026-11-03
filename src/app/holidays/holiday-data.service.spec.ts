import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HolidayDataService } from './holiday-data.service';
import { HolidayStore } from './holiday.store';

describe('HolidayDataService', () => {
  let service: HolidayDataService;
  let http: HttpTestingController;
  let online: boolean;

  beforeEach(() => {
    online = true;
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => online });
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HolidayDataService],
    });
    service = TestBed.inject(HolidayDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads and caches the selected year and state using the V2 endpoint', async () => {
    const holidaysPromise = service.load(2026, 'BY').toPromise();
    const request = http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        start: '2026-02-16T00:00Z',
        end: '2026-02-20T23:59Z',
        year: 2026,
        stateCode: 'BY',
        name: 'winterferien',
        name_cp: 'Winterferien',
        slug: 'winterferien-2026-BY',
        id: 'winterferien-2026-BY-2026-02-16',
      },
    ]);

    await expect(holidaysPromise).resolves.toMatchObject([
      {
        type: 'winterferien', label: 'Winterferien', startDate: '2026-02-16', endDate: '2026-02-20',
        year: 2026, stateCode: 'BY', slug: 'winterferien-2026-BY', id: 'winterferien-2026-BY-2026-02-16',
      },
    ]);
    expect(localStorage.length).toBe(1);
  });

  it('replaces the cached payload after a successful online refresh', async () => {
    const cacheKey = 'school-holidays:v2:2026:BY';
    const initialLoad = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush([
      {
        start: '2026-02-16T00:00Z', end: '2026-02-20T23:59Z', year: 2026, stateCode: 'BY',
        name: 'winterferien', name_cp: 'Winterferien', slug: 'winterferien-2026-BY', id: 'winterferien-1',
      },
    ]);
    await initialLoad;

    const refreshedPayload = [
      {
        start: '2026-07-06T00:00Z', end: '2026-07-17T23:59Z', year: 2026, stateCode: 'BY',
        name: 'sommerferien', name_cp: 'Sommerferien', slug: 'sommerferien-2026-BY', id: 'sommerferien-1',
      },
    ];
    const refreshedLoad = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush(refreshedPayload);

    await expect(refreshedLoad).resolves.toMatchObject([
      { type: 'sommerferien', startDate: '2026-07-06', endDate: '2026-07-17' },
    ]);
    expect(JSON.parse(localStorage.getItem(cacheKey)!)).toEqual(refreshedPayload);
  });

  it('serves the last successful payload on offline reload without requesting the API', async () => {
    const onlineLoad = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush([
      {
        start: '2026-02-16T00:00Z', end: '2026-02-20T23:59Z', year: 2026, stateCode: 'BY',
        name: 'winterferien', name_cp: 'Winterferien', slug: 'winterferien-2026-BY', id: 'winterferien-1',
      },
    ]);
    const cached = await onlineLoad;

    online = false;
    const store = TestBed.inject(HolidayStore);
    store.reload();

    expect(store.holidays()).toEqual(cached);
    http.expectNone('https://schulferien-api.de/api/v2/2026?states=BY');
  });

  it('returns an empty list offline when no cached payload exists', async () => {
    online = false;

    await expect(service.load(2026, 'BY').toPromise()).resolves.toEqual([]);
    http.expectNone('https://schulferien-api.de/api/v2/2026?states=BY');
  });

  it('uses the last successful payload when an online refresh fails', async () => {
    const firstLoad = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush([
      {
        start: '2026-02-16T00:00Z', end: '2026-02-20T23:59Z', year: 2026, stateCode: 'BY',
        name: 'winterferien', name_cp: 'Winterferien', slug: 'winterferien-2026-BY', id: 'winterferien-1',
      },
    ]);
    const cached = await firstLoad;

    const failedRefresh = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush('unavailable', { status: 503, statusText: 'Unavailable' });
    await expect(failedRefresh).resolves.toEqual(cached);
  });

  it('does not request unsupported years or state codes', async () => {
    await expect(service.load(2030, 'BY').toPromise()).resolves.toEqual([]);
    await expect(service.load(2026, 'XX').toPromise()).resolves.toEqual([]);
    http.expectNone(() => true);
  });

  it('does not cache malformed API responses', async () => {
    const requestResult = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush({ invalid: true });

    await expect(requestResult).resolves.toEqual([]);
    expect(localStorage.length).toBe(0);
  });

  it('does not cache an invalid record or replace a previously successful cache', async () => {
    const invalidRecord = {
      start: '2026-02-16T00:00Z', end: '2026-02-20T23:59Z', year: 2026, stateCode: 'BY',
      name: 'winterferien', name_cp: 'Winterferien', slug: 'winterferien-2026-BY', id: null,
    };
    const invalidLoad = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush([invalidRecord]);
    await expect(invalidLoad).resolves.toEqual([]);
    expect(localStorage.length).toBe(0);

    const validLoad = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush([
      {
        start: '2026-02-16T00:00Z', end: '2026-02-20T23:59Z', year: 2026, stateCode: 'BY',
        name: 'winterferien', name_cp: 'Winterferien', slug: 'winterferien-2026-BY', id: 'winterferien-1',
      },
    ]);
    const cached = await validLoad;
    const cacheKey = 'school-holidays:v2:2026:BY';
    const successfulCache = localStorage.getItem(cacheKey);

    const invalidRefresh = service.load(2026, 'BY').toPromise();
    http.expectOne('https://schulferien-api.de/api/v2/2026?states=BY').flush([invalidRecord]);

    await expect(invalidRefresh).resolves.toEqual(cached);
    expect(localStorage.getItem(cacheKey)).toBe(successfulCache);
  });

  it('ignores a corrupt local cache while offline', async () => {
    online = false;
    localStorage.setItem('school-holidays:v2:2026:BY', '{invalid');

    await expect(service.load(2026, 'BY').toPromise()).resolves.toEqual([]);
    http.expectNone(() => true);
  });
});