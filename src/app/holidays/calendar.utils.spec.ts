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
    const winterWeek = sections[0].weeks[0];
    expect(winterWeek.days[0].holidays).toEqual([winterHoliday]);
    expect(winterWeek.days[4].holidays).toEqual([winterHoliday]);
    expect(winterWeek.days[5].holidays).toEqual([]);
    expect(sections[1].weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it('includes the following year when a selected-year holiday crosses into January', () => {
    const holiday = { ...winterHoliday, startDate: '2026-12-30', endDate: '2027-01-08' };
    const section = buildHolidaySections(2026, [holiday])[0];
    const finalHolidayDay = section.weeks.flatMap((week) => week.days).find((day) => day.date === '2027-01-08');

    expect(finalHolidayDay?.inSelectedYear).toBe(false);
    expect(finalHolidayDay?.holidays).toEqual([holiday]);
  });

  it('returns no sections when there are no holidays', () => {
    expect(buildHolidaySections(2026, [])).toEqual([]);
  });
});