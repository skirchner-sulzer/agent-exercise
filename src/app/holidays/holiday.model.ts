export const HOLIDAY_API_URL = 'https://schulferien-api.de';
export const SUPPORTED_YEARS = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029] as const;

export const STATES = [
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'NW', name: 'Nordrhein-Westfalen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thüringen' },
] as const;

export interface Holiday {
  type: string;
  label: string;
  startDate: string;
  endDate: string;
  year: number;
  stateCode: string;
  slug: string;
  id: string;
}

export interface HolidayApiRecord {
  start: string;
  end: string;
  year: number;
  stateCode: string;
  name: string;
  name_cp: string;
  slug: string;
  id: string;
}

function dateOnly(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return null;
  }

  const date = value.slice(0, 10);
  const parsed = new Date(`${date}T00:00:00Z`);
  return parsed.toISOString().slice(0, 10) === date ? date : null;
}

export function normalizeHolidayResponse(payload: unknown): Holiday[] {
  if (!Array.isArray(payload)) {
    throw new Error('The holiday API response must be an array.');
  }

  return payload.map((record: unknown) => {
    if (!record || typeof record !== 'object') {
      throw new Error('The holiday API returned an invalid record.');
    }

    const item = record as Record<string, unknown>;
    const startDate = dateOnly(item['start']);
    const endDate = dateOnly(item['end']);
    const year = item['year'];
    const stateCode = item['stateCode'];
    const type = item['name'];
    const label = item['name_cp'];
    const slug = item['slug'];
    const id = item['id'];

    if (
      !startDate || !endDate || startDate > endDate || !Number.isInteger(year) ||
      typeof stateCode !== 'string' || typeof type !== 'string' || typeof label !== 'string' ||
      typeof slug !== 'string' || typeof id !== 'string'
    ) {
      throw new Error('The holiday API returned a record with missing or invalid fields.');
    }

    return { type, label, startDate, endDate, year: year as number, stateCode, slug, id };
  });
}