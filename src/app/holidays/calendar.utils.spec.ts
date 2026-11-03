import { buildCalendarWeeks, buildHolidaySections } from './calendar.utils';
import { Holiday } from './holiday.model';

const winterHoliday: Holiday = {
  type: 'winterferien',
  label: 'Winterferien',
  startDate: '2026-02-16',
  endDate: '2026-02-20',
  year: 2026,
  stateCode: 'BY',
  slug: 'winterferien-2026-BY',
  id: 'winterferien-2026-BY-2026-02-16',
};

describe('calendar utilities', () => {
  it('creates complete Monday-to-Sunday weeks and ISO week numbers at year boundaries', () => {
    const weeks = buildCalendarWeeks(2026, []);

    expect(weeks[0].startDate).toBe('2025-12-29');
    expect(weeks[0].weekNumber).toBe(1);
    expect(weeks.at(-1)?.startDate).toBe('2026-12-28');
    expect(weeks.at(-1)?.weekNumber).toBe(53);
    expect(weeks.every((week) => week.days.length === 7)).toBe(true);
    expect(weeks[0].days[0].inSelectedYear).toBe(false);
    expect(weeks[0].days[3].inSelectedYear).toBe(true);
  });

  it('marks each date in a holiday and groups calendar weeks by holiday type', () => {
    const sections = buildHolidaySections(2026, [
      winterHoliday,
      { ...winterHoliday, type: 'osterferien', label: 'Osterferien', startDate: '2026-04-06', endDate: '2026-04-17' },
    ]);

    expect(sections.map((section) => section.type)).toEqual(['winterferien', 'osterferien']);
    const winterWeek = sections[0].weeks.find((week) => week.days.some((day) => day.date === winterHoliday.startDate));
    expect(winterWeek?.days[0].holidays).toEqual([winterHoliday]);
    expect(winterWeek?.days[4].holidays).toEqual([winterHoliday]);
    expect(winterWeek?.days[5].holidays).toEqual([]);
    expect(sections[1].weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it('formats the full holiday-type span across gaps and within one year', () => {
    const holidays = [
      { ...winterHoliday, startDate: '2026-07-10', endDate: '2026-07-12' },
      { ...winterHoliday, startDate: '2026-07-01', endDate: '2026-07-03' },
    ];

    expect(buildHolidaySections(2026, holidays)[0].dateRange).toBe('01.07.–12.07.2026');
  });

  it('calculates independent date spans for each holiday type', () => {
    const holidays = [
      { ...winterHoliday, startDate: '2026-01-05', endDate: '2026-01-09' },
      { ...winterHoliday, type: 'sommerferien', label: 'Sommerferien', startDate: '2026-07-20', endDate: '2026-08-07' },
    ];
    const sections = buildHolidaySections(2026, holidays);

    expect(sections.map((section) => section.type)).toEqual(['winterferien', 'sommerferien']);
    expect(sections.map((section) => section.dateRange)).toEqual([
      '05.01.–09.01.2026',
      '20.07.–07.08.2026',
    ]);
  });

  it('formats both years when the holiday-type span crosses a year boundary', () => {
    const holidays = [
      { ...winterHoliday, startDate: '2026-12-28', endDate: '2026-12-30' },
      { ...winterHoliday, startDate: '2027-01-05', endDate: '2027-01-08' },
    ];

    expect(buildHolidaySections(2026, holidays)[0].dateRange).toBe('28.12.2026–08.01.2027');
  });

  it('includes the full weeks before and after a holiday contained in one week', () => {
    const holiday = { ...winterHoliday, startDate: '2026-03-03', endDate: '2026-03-06' };
    const section = buildHolidaySections(2026, [holiday])[0];

    expect(section.weeks.map((week) => week.startDate)).toEqual([
      '2026-02-23',
      '2026-03-02',
      '2026-03-09',
    ]);
    expect(section.weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it('includes the weeks adjacent to a holiday spanning multiple weeks', () => {
    const holiday = { ...winterHoliday, startDate: '2026-04-29', endDate: '2026-05-08' };
    const section = buildHolidaySections(2026, [holiday])[0];

    expect(section.weeks.map((week) => week.startDate)).toEqual([
      '2026-04-20',
      '2026-04-27',
      '2026-05-04',
      '2026-05-11',
    ]);
    expect(section.weeks[1].days[2].holidays).toEqual([holiday]);
    expect(section.weeks[2].days[4].holidays).toEqual([holiday]);
  });

  it('deduplicates shared additional weeks within a holiday type', () => {
    const holidays = [
      { ...winterHoliday, startDate: '2026-02-16', endDate: '2026-02-20' },
      { ...winterHoliday, startDate: '2026-03-02', endDate: '2026-03-06' },
    ];
    const section = buildHolidaySections(2026, holidays)[0];

    expect(section.weeks.map((week) => week.startDate)).toEqual([
      '2026-02-09',
      '2026-02-16',
      '2026-02-23',
      '2026-03-02',
      '2026-03-09',
    ]);
    expect(new Set(section.weeks.map((week) => week.startDate)).size).toBe(section.weeks.length);
  });

  it('deduplicates weeks and retains both holidays on overlapping dates', () => {
    const holidays = [
      { ...winterHoliday, startDate: '2026-02-16', endDate: '2026-02-20' },
      { ...winterHoliday, startDate: '2026-02-19', endDate: '2026-02-24' },
    ];
    const section = buildHolidaySections(2026, holidays)[0];
    const overlappingWeek = section.weeks.find((week) => week.days.some((day) => day.date === '2026-02-19'));
    const overlappingDay = overlappingWeek?.days.find((day) => day.date === '2026-02-19');

    expect(section.weeks.map((week) => week.startDate)).toEqual([
      '2026-02-09',
      '2026-02-16',
      '2026-02-23',
      '2026-03-02',
    ]);
    expect(new Set(section.weeks.map((week) => week.startDate)).size).toBe(section.weeks.length);
    expect(overlappingDay?.holidays).toEqual(holidays);
  });

  it('keeps identical additional weeks in separate holiday-type sections', () => {
    const secondType = { ...winterHoliday, type: 'osterferien', label: 'Osterferien' };
    const sections = buildHolidaySections(2026, [winterHoliday, secondType]);

    expect(sections).toHaveLength(2);
    expect(sections[0].weeks.map((week) => week.startDate)).toEqual(sections[1].weeks.map((week) => week.startDate));
    expect(sections[0].weeks).not.toBe(sections[1].weeks);
  });

  it('includes the following year when a selected-year holiday crosses into January', () => {
    const holiday = { ...winterHoliday, startDate: '2026-12-30', endDate: '2027-01-08' };
    const section = buildHolidaySections(2026, [holiday])[0];
    const finalHolidayDay = section.weeks.flatMap((week) => week.days).find((day) => day.date === '2027-01-08');

    expect(finalHolidayDay?.inSelectedYear).toBe(false);
    expect(finalHolidayDay?.holidays).toEqual([holiday]);
    expect(section.weeks.map((week) => week.startDate)).toEqual([
      '2026-12-21',
      '2026-12-28',
      '2027-01-04',
      '2027-01-11',
    ]);
    expect(section.weeks[0].days[0].inSelectedYear).toBe(true);
    expect(section.weeks.at(-1)?.days.every((day) => !day.inSelectedYear)).toBe(true);
    expect(section.weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it('includes the full preceding week outside the selected year at its start', () => {
    const holiday = { ...winterHoliday, startDate: '2026-01-01', endDate: '2026-01-02' };
    const section = buildHolidaySections(2026, [holiday])[0];

    expect(section.weeks.map((week) => week.startDate)).toEqual([
      '2025-12-22',
      '2025-12-29',
      '2026-01-05',
    ]);
    expect(section.weeks[0].days.every((day) => !day.inSelectedYear)).toBe(true);
    expect(section.weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it('returns no sections when there are no holidays', () => {
    expect(buildHolidaySections(2026, [])).toEqual([]);
  });
});