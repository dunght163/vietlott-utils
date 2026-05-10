const TIMEZONE = 'Asia/Ho_Chi_Minh';

const datePartsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const timePartsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDateRaw(date: Date): string {
  return datePartsFormatter.format(date);
}

export function formatDisplayDate(date: Date): string {
  const [yyyy, mm, dd] = formatDateRaw(date).split('-');
  return `${dd}/${mm}/${yyyy}`;
}

export function formatDisplayTime(date: Date): string {
  return timePartsFormatter.format(date);
}

export function dayBoundsUtc(dateRaw: string): { start: Date; end: Date } {
  const [y, m, d] = dateRaw.split('-').map(Number);
  const startLocal = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  const offsetMs = computeTzOffsetMs(startLocal);
  const start = new Date(startLocal.getTime() - offsetMs);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function computeTzOffsetMs(date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - date.getTime();
}
