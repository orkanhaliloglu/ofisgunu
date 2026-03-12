import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWeekend,
  isSameMonth,
  format,
} from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Gets the days of the month grouped by week for a given year and month.
 */
export function getCalendarWeeks(year, monthIndex) {
  const monthStart = startOfMonth(new Date(year, monthIndex));
  const monthEnd = endOfMonth(monthStart);

  // Get the start of the first week (could be in the previous month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return weeks;
}

/**
 * Checks if a given day is a working day (Monday-Friday).
 */
export function isWorkingDay(date) {
  return !isWeekend(date);
}

/**
 * Calculate the required office days for a given number of available working days.
 * Using standard Math.round for 4 days -> 2 (1.6), 3 days -> 1 (1.2).
 */
export function calculateRequiredOfficeDays(availableWorkingDays) {
  return Math.round(availableWorkingDays * 0.4);
}

/**
 * Format a month/year for display
 */
export function formatMonthYear(year, monthIndex) {
  return format(new Date(year, monthIndex), 'MMMM yyyy', { locale: tr });
}

/**
 * Get the standardized "YYYY-MM-DD" string key for a Date
 */
export function getDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Hardcoded Turkish Public Holidays (ex: 2024-2026)
 * Format: YYYY-MM-DD
 */
export const PUBLIC_HOLIDAYS = [
  // 2024
  '2024-01-01', '2024-04-09', '2024-04-10', '2024-04-11', '2024-04-12', '2024-04-23', '2024-05-01', '2024-05-19', '2024-06-15', '2024-06-16', '2024-06-17', '2024-06-18', '2024-06-19', '2024-07-15', '2024-08-30', '2024-10-29',
  // 2025
  '2025-01-01', '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01', '2025-04-23', '2025-05-01', '2025-05-19', '2025-06-05', '2025-06-06', '2025-06-07', '2025-06-08', '2025-06-09', '2025-07-15', '2025-08-30', '2025-10-28', '2025-10-29',
  // 2026
  '2026-01-01', // Yılbaşı
  '2026-03-19', // Ramazan B. Arife
  '2026-03-20', // Ramazan B.
  '2026-03-21', // Ramazan B.
  '2026-03-22', // Ramazan B.
  '2026-04-23', // Ulusal Egemenlik
  '2026-05-01', // İşçi Bayramı
  '2026-05-19', // Atatürk'ü Anma
  '2026-05-26', // Kurban B. Arife
  '2026-05-27', // Kurban B.
  '2026-05-28', // Kurban B.
  '2026-05-29', // Kurban B.
  '2026-05-30', // Kurban B.
  '2026-07-15', // Demokrasi
  '2026-08-30', // Zafer Bayramı
  '2026-10-28', // Cumhuriyet B. Arife
  '2026-10-29', // Cumhuriyet Bayramı
];

/**
 * Checks if a given date is a public holiday
 */
export function isPublicHoliday(date) {
  const key = getDateKey(date);
  return PUBLIC_HOLIDAYS.includes(key);
}
