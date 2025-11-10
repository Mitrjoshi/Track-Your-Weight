import { format, isValid } from "date-fns";
import { parseISO } from "date-fns/parseISO";

export const formatDate = (dateInput: Date | string | number): string => {
  let date: Date;

  if (typeof dateInput === "number") {
    date = new Date(dateInput);
  } else if (typeof dateInput === "string") {
    date = parseISO(dateInput);
  } else {
    date = dateInput;
  }

  if (!isValid(date)) return "Invalid Date";

  return format(date, "MMM d, yyyy");
};

export const greetingBasedOnTime = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good Morning!";
  } else if (currentHour < 18) {
    return "Good Afternoon!";
  } else {
    return "Good Evening!";
  }
};
