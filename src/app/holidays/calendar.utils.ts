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
  weeks: CalendarWeek[];
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
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

export function buildCalendarWeeks(year: number, holidays: Holiday[]): CalendarWeek[] {
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

    weeks.push({ startDate: formatDate(weekStart), weekNumber: isoWeekNumber(weekStart), days });
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
    const weeks = buildCalendarWeeks(year, items).filter((week) => week.days.some((day) => day.holidays.length > 0));
    return { type, label: items[0].label, weeks };
  }).filter((section) => section.weeks.length > 0);
}