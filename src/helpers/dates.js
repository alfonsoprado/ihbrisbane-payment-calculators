import {
  parse,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format
} from "date-fns";

export function formatDate(date) {
  return format(date, "dd/MM/yyyy");
}

export function findThisWeekFriday(dateInitial) {
  if (typeof dateInitial === "string") {
    dateInitial = parse(dateInitial, "yyyy-MM-dd", new Date());
  }

  const startOfTheWeek = startOfWeek(dateInitial, { weekStartsOn: 1 });

  const fridayThisWeek = addDays(startOfTheWeek, 4);

  return fridayThisWeek;
}

export function findFridayOfFollowingWeeks(dateInitial, weeksInTheFuture = 0) {
  if (typeof dateInitial === "string") {
    dateInitial = parse(dateInitial, "yyyy-MM-dd", new Date());
  }

  const startOfTheWeek = startOfWeek(dateInitial, { weekStartsOn: 1 });

  const futureWeek = addWeeks(startOfTheWeek, weeksInTheFuture);

  const fridayOfFutureWeek = addDays(futureWeek, 4);

  return fridayOfFutureWeek;
}

export function findFridayOfPreviousWeeks(dateInitial, weeksInThePast = 0) {
  if (typeof dateInitial === "string") {
    dateInitial = parse(dateInitial, "yyyy-MM-dd", new Date());
  }
  const startOfTheWeek = startOfWeek(dateInitial, { weekStartsOn: 1 });

  const pastWeek = subWeeks(startOfTheWeek, weeksInThePast);

  const fridayOfPastWeek = addDays(pastWeek, 4);

  return fridayOfPastWeek;
}
