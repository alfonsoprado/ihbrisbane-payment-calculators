import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../helpers/dates";
import { discount } from "./discount";
import { generateTotalPayments } from "./total";
import { generateExtraFees } from "./extra-fees";

function generatePaymentsOption1(courseName, startDate, coursePrice) {
  const payments = [];

  // 3 days before friday payment
  const fridayBeforeStartClass = findFridayOfPreviousWeeks(startDate, 1);
  payments.push({
    dueDate: formatDate(fridayBeforeStartClass),
    courseName,
    feeDescription: "Tuition",
    paymentAmount: 1000
  });

  // Every 4 weeks payment
  let paymentDate = startDate;
  for (let i = 1000; i <= coursePrice - 1000; i += 1000) {
    paymentDate = findFridayOfFollowingWeeks(paymentDate, 4);
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition",
      paymentAmount: 1000
    });
  }

  // Last week, if there is a residual payment
  const lastPayment = coursePrice % 1000;
  if (lastPayment !== 0) {
    payments.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(paymentDate, 4)),
      courseName,
      feeDescription: "Tuition",
      paymentAmount: lastPayment
    });
  }

  return payments;
}

export function option1(courses, specialCases) {
  let result = generateExtraFees();

  // First tuition
  let firstTuition = 300;
  if (courses.length > 1) {
    firstTuition = 500;
    specialCases = { ...specialCases, multipleCourses: true };
  }

  result = [
    ...result,
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition",
      courseName: courses[0].name,
      paymentAmount: firstTuition
    }
  ];

  const totalTuitions = [];
  for (const [index, course] of courses.entries()) {
    let { name, startDate, price } = course;
    if (index === courses.length - 1) {
      // Last discount: include amount and percentage
      price = discount(price, specialCases, true).finalPrice;
    } else {
      // Other discounts: only include percentage
      price = discount(price, specialCases).finalPrice;
    }
    totalTuitions.push(price);
    // Remove amount of the first tuition of the first price
    if (index === 0) {
      price -= firstTuition;
    }
    result = [...result, ...generatePaymentsOption1(name, startDate, price)];
  }

  result = generateTotalPayments(result, totalTuitions);

  return result;
}
