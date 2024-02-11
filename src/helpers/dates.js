import {
  parse,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  parseISO,
} from "date-fns";
export function formatDate(date, formatDate = "dd/MM/yyyy") {
  return format(date, formatDate);
}

export function findFinishDateCourse(dateInitial, weeksInTheFuture = 0) {
  if (typeof dateInitial === "string") {
    dateInitial = parse(dateInitial, "yyyy-MM-dd", new Date());
  }
  const startOfTheWeek = startOfWeek(dateInitial, { weekStartsOn: 1 });
  const futureWeek = addWeeks(startOfTheWeek, weeksInTheFuture - 1);
  const fridayOfFutureWeek = addDays(futureWeek, 4);
  return fridayOfFutureWeek;
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


export function checkForOverlaps(dateRanges) {
  for (let i = 0; i < dateRanges.length; i++) {
    const start1 = parseISO(dateRanges[i].startDate);
    const end1 = parseISO(dateRanges[i].finishDate);

    for (let j = i + 1; j < dateRanges.length; j++) {
      const start2 = parseISO(dateRanges[j].startDate);
      const end2 = parseISO(dateRanges[j].finishDate);

      if (start1 <= end2 && start2 <= end1) {
        // Found overlaps
        return true;
      }
    }
  }
  // Not found overlaps
  return false;
}