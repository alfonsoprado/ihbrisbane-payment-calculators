import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../helpers/dates";
import { discount } from "./discount";
import { generateTotalPayments } from "./total";
import { generateExtraFees } from "./extra-fees";

function generatePaymentSingleCourse(course, specialCases, result) {
  let { name, startDate, price } = course;
  price = discount(price, specialCases, true).finalPrice;
  const totalTuitions = [price];

  result = [
    ...result,
    {
      dueDate: formatDate(new Date()),
      courseName: name,
      feeDescription: "Tuition",
      paymentAmount: price * 0.2
    },
    {
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName: name,
      feeDescription: "Tuition",
      paymentAmount: price * 0.3
    },
    {
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, 10)),
      courseName: name,
      feeDescription: "Tuition",
      paymentAmount: price * 0.2
    },
    {
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, 14)),
      courseName: name,
      feeDescription: "Tuition",
      paymentAmount: price * 0.3
    }
  ];

  result = generateTotalPayments(result, totalTuitions);

  return result;
}

function generatePaymentMultipleCourses(courses, specialCases, result) {
  courses = courses.map((course) => ({
    ...course
  }));
  for (const [index, course] of courses.entries()) {
    //let { name, startDate, price } = course;
    if (index === courses.length - 1) {
      // Last discount: include amount and percentage
      course.tuition = discount(course.price, specialCases, true).finalPrice;
    } else {
      // Other discounts: only include percentage
      course.tuition = discount(course.price, specialCases).finalPrice;
    }
  }

  // Stage 1
  const paymentsS1 = [
    {
      dueDate: formatDate(new Date()),
      courseName: courses[0].name,
      feeDescription: "Tuition",
      paymentAmount: 0
    }
  ];
  for (const course of courses) {
    paymentsS1[0].paymentAmount += course.tuition * 0.2;
    paymentsS1.push({
      dueDate: formatDate(findFridayOfPreviousWeeks(course.startDate, 1)),
      courseName: course.name,
      feeDescription: "Tuition",
      paymentAmount: course.tuition * 0.2
    });
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(course.startDate, 10)),
      courseName: course.name,
      feeDescription: "Tuition",
      paymentAmount: course.tuition * 0.3
    });
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(course.startDate, 14)),
      courseName: course.name,
      feeDescription: "Tuition",
      paymentAmount: course.tuition * 0.3
    });
  }

  // Stage 2
  const paymentsS2 = [];

  const tuitions = courses.map((course) => course.tuition);
  let remainder = tuitions.shift();
  for (const payment of paymentsS1) {
    remainder -= payment.paymentAmount;
    if (remainder < 0) {
      paymentsS2.push({
        ...payment,
        paymentAmount: payment.paymentAmount + remainder
      });
      paymentsS2.push({
        ...payment,
        paymentAmount: Math.abs(remainder)
      });
      remainder += tuitions.shift();
    } else {
      paymentsS2.push(payment);
    }
  }

  result = [...result, ...paymentsS2];

  result = generateTotalPayments(
    result,
    courses.map((course) => course.tuition)
  );

  return result;
}

export function option2(courses, specialCases) {
  let result = generateExtraFees();

  if (courses.length === 1) {
    result = generatePaymentSingleCourse(courses[0], specialCases, result);
  } else {
    specialCases = { ...specialCases, multipleCourses: true };
    result = generatePaymentMultipleCourses(courses, specialCases, result);
  }

  return result;
}
