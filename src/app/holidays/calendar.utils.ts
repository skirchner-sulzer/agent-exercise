import { Holiday } from './holiday.model';

export interface CalendarDay {
  date: string;
  dayOfMonth: number;
  inSelectedYear: boolean;
  holidays: Holiday[];
}

export interface CalendarWeek {
  startDate: string;
  weekNumber: number;
  days: CalendarDay[];
}

export interface HolidaySection {
  type: string;
  label: string;
  dateRange: string;
  weeks: CalendarWeek[];
}

export interface CalendarDayView {
  date: string;
  dayOfMonth: number;
  inSelectedYear: boolean;
  isHoliday: boolean;
  accessibleLabel: string;
}

export interface CalendarWeekView extends Omit<CalendarWeek, 'days'> {
  days: CalendarDayView[];
}

export interface HolidaySectionView extends Omit<HolidaySection, 'weeks'> {
  weeks: CalendarWeekView[];
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatHolidayDateRange(holidays: Holiday[]): string {
  const startDate = holidays.reduce((earliest, holiday) => holiday.startDate < earliest ? holiday.startDate : earliest, holidays[0].startDate);
  const endDate = holidays.reduce((latest, holiday) => holiday.endDate > latest ? holiday.endDate : latest, holidays[0].endDate);
  const start = `${startDate.slice(8, 10)}.${startDate.slice(5, 7)}`;
  const end = `${endDate.slice(8, 10)}.${endDate.slice(5, 7)}`;
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);

  return startYear === endYear
    ? `${start}.–${end}.${endYear}`
    : `${start}.${startYear}–${end}.${endYear}`;
}

function mondayFor(date: Date): Date {
  const monday = new Date(date);
  const weekday = (monday.getUTCDay() + 6) % 7;
  monday.setUTCDate(monday.getUTCDate() - weekday);
  return monday;
}

function isoWeekNumber(monday: Date): number {
  const thursday = new Date(monday);
  thursday.setUTCDate(thursday.getUTCDate() + 3);
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const firstMonday = mondayFor(firstThursday);
  return Math.round((monday.getTime() - firstMonday.getTime()) / 604_800_000) + 1;
}

function buildCalendarWeek(year: number, weekStart: Date, holidays: Holiday[]): CalendarWeek {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(date.getUTCDate() + index);
    const dateString = formatDate(date);
    return {
      date: dateString,
      dayOfMonth: date.getUTCDate(),
      inSelectedYear: date.getUTCFullYear() === year,
      holidays: holidays.filter((holiday) => holiday.startDate <= dateString && holiday.endDate >= dateString),
    };
  });

  return { startDate: formatDate(weekStart), weekNumber: isoWeekNumber(weekStart), days };
}

export function buildCalendarWeeks(year: number, holidays: Holiday[], dayHolidays = holidays): CalendarWeek[] {
  const firstDay = new Date(Date.UTC(year, 0, 1));
  const lastDay = new Date(Date.UTC(year, 11, 31));
  for (const holiday of holidays) {
    const holidayStart = new Date(`${holiday.startDate}T00:00:00Z`);
    const holidayEnd = new Date(`${holiday.endDate}T00:00:00Z`);
    if (holidayStart < firstDay) {
      firstDay.setTime(holidayStart.getTime());
    }
    if (holidayEnd > lastDay) {
      lastDay.setTime(holidayEnd.getTime());
    }
  }

  const firstMonday = mondayFor(firstDay);
  const finalSunday = mondayFor(lastDay);
  finalSunday.setUTCDate(finalSunday.getUTCDate() + 6);

  const weeks: CalendarWeek[] = [];
  for (const weekStart = new Date(firstMonday); weekStart <= finalSunday; weekStart.setUTCDate(weekStart.getUTCDate() + 7)) {
    weeks.push(buildCalendarWeek(year, weekStart, dayHolidays));
  }

  return weeks;
}

export function buildHolidaySections(year: number, holidays: Holiday[]): HolidaySection[] {
  const byType = new Map<string, Holiday[]>();
  for (const holiday of holidays) {
    const group = byType.get(holiday.type) ?? [];
    group.push(holiday);
    byType.set(holiday.type, group);
  }

  return Array.from(byType, ([type, items]) => {
    const weeksByStart = new Map(buildCalendarWeeks(year, items, holidays).map((week) => [week.startDate, week]));
    const additionalWeekStarts = new Set<string>();

    for (const holiday of items) {
      const startWeek = mondayFor(new Date(`${holiday.startDate}T00:00:00Z`));
      startWeek.setUTCDate(startWeek.getUTCDate() - 7);
      additionalWeekStarts.add(formatDate(startWeek));

      const endWeek = mondayFor(new Date(`${holiday.endDate}T00:00:00Z`));
      endWeek.setUTCDate(endWeek.getUTCDate() + 7);
      additionalWeekStarts.add(formatDate(endWeek));
    }

    for (const weekStart of additionalWeekStarts) {
      if (!weeksByStart.has(weekStart)) {
        weeksByStart.set(weekStart, buildCalendarWeek(year, new Date(`${weekStart}T00:00:00Z`), holidays));
      }
    }

    const weeks = Array.from(weeksByStart.values())
      .filter((week) => additionalWeekStarts.has(week.startDate) || week.days.some((day) => day.holidays.some((holiday) => holiday.type === type)))
      .sort((left, right) => left.startDate.localeCompare(right.startDate));

    return { type, label: items[0].label, dateRange: formatHolidayDateRange(items), weeks };
  }).filter((section) => section.weeks.length > 0);
}