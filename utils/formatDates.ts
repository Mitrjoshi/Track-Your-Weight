import {
  differenceInHours,
  format,
  isSameDay,
  isValid,
  subDays,
} from "date-fns";
import { parseISO } from "date-fns/parseISO";

// Format to 24-hour time (e.g. "14:30")
export function formatTime24Hours(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  if (!isValid(date)) return "Invalid Date";
  return format(date, "HH:mm");
}

// Format date like WhatsApp: Today shows time, Yesterday as label, else "June 20"
export function formatDayAndTime(input: Date): string {
  const now = new Date();
  const yesterday = subDays(now, 1);

  if (isSameDay(input, now)) return formatTime24Hours(input);
  if (isSameDay(input, yesterday)) return "Yesterday";

  return format(input, "MMM d"); // e.g. "June 20"
}

// Only returns "Today", "Yesterday" or "June 20"
export const formatDay = (input: Date): string => {
  const now = new Date();
  const yesterday = subDays(now, 1);

  if (isSameDay(input, now)) return "Today";
  if (isSameDay(input, yesterday)) return "Yesterday";

  return format(input, "MMMM d");
};

// Format full date (e.g. Today, Yesterday, or August 2, 2025)
export const formatDate = (dateInput: Date | string | number): string => {
  let date: Date;

  if (typeof dateInput === "number") {
    // number → convert timestamp (in ms) to Date
    date = new Date(dateInput);
  } else if (typeof dateInput === "string") {
    // string → parse as ISO string
    date = parseISO(dateInput);
  } else {
    // already a Date
    date = dateInput;
  }

  if (!isValid(date)) return "Invalid Date";

  return format(date, "MMM d, yyyy");
};

// Returns true if two dates differ by more than 1 hour
export const checkTimeDifference = (dateOne: Date, dateTwo: Date) => {
  return differenceInHours(dateOne, dateTwo) > 1;
};

// Checks if two dates are not on the same calendar day
export const isDifferentDay = (dateOne: Date, dateTwo: Date): boolean => {
  return !isSameDay(dateOne, dateTwo);
};

// Returns true if message can be modified within time limit (ms)
export function canModifyMessage(
  messageTimestamp: string,
  time: number
): boolean {
  const timestamp = parseISO(messageTimestamp);
  if (!isValid(timestamp)) {
    console.warn("Invalid timestamp string:", messageTimestamp);
    return false;
  }
  const now = new Date();
  return now.getTime() - timestamp.getTime() <= time;
}

// Converts seconds to hh:mm:ss or mm:ss format
export const convertSecondsTime = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const padded = (num: number) => String(num).padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${padded(mins)}:${padded(secs)}`;
  } else {
    return `${mins}:${padded(secs)}`;
  }
};

export function formatTimeAgo(
  date: Date | string | number,
  text: string = "Sent"
): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return `${text} just now`;
  if (seconds < 60) return `${text} ${seconds}s ago`;
  if (minutes < 60) return `${text} ${minutes}m ago`;
  if (hours < 24) return `${text} ${hours}h ago`;
  if (days <= 7) return `${text} ${days}d ago`;

  // More than 7 days -> return full date (e.g., Jan 5, 2025)
  return `${text} on ${past.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
}
