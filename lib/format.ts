const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function toDate(date: Date | string) {
  return date instanceof Date ? date : new Date(date);
}

export function formatMonthYear(date: Date | string) {
  return monthYearFormatter.format(toDate(date));
}

export function formatDateRange(
  start: Date | string,
  end: Date | string | null,
) {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : "Present"}`;
}

export function formatLongDate(date: Date | string) {
  return longDateFormatter.format(toDate(date));
}

export function formatTimestamp(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(toDate(date));
}
