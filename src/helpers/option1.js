import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../helpers/dates";
import { discount } from "./discount";
import { generateTotalPayments } from "./total";
import { getOptionParameters } from "./tools";

function generatePaymentsOption1(data, courseName, startDate, coursePrice) {
  const {
    tuition_installments_amount: TIA, // $1000 AUS
    third_tuition_installment_n_weeks_after_course_start: TTIWACS, // 10 weeks
    tuition_installments_interval_weeks_after_third_tuition: TIIWATT, // Month = 4 weeks
  } = getOptionParameters(data, 'option_1');

  const payments = [];

  let remainingAmount = coursePrice;

  if (TIA <= remainingAmount) {
    // Second tuition: 3 days before friday payment
    const fridayBeforeStartClass = findFridayOfPreviousWeeks(startDate, 1);
    payments.push({
      dueDate: formatDate(fridayBeforeStartClass),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA
    });
    remainingAmount -= TIA;
  }

  let paymentDate = findFridayOfFollowingWeeks(startDate, TTIWACS);
  if (TIA <= remainingAmount) {
    // Third tuition: n weeks after course start date, n = TTIWACS = 10 weeks
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA
    });
    remainingAmount -= TIA;
  }

  // Every month payment
  while (TIA <= remainingAmount) {
    paymentDate = findFridayOfFollowingWeeks(paymentDate, TIIWATT);
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA
    });
    remainingAmount -= TIA;
  }

  // Last month, if there is a residual payment
  if(remainingAmount !== 0) {
    payments.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(paymentDate, TIIWATT)),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: remainingAmount
    });
  }

  return payments;
}

export function option1(data, extraFees, courses, specialCases) {
  const {
    first_tuition_installment_single_course_amount: FTISCA, // $300 AUS
    first_tuition_installment_multiple_courses_amount: FTIMCA, // $500 AUS
  } = getOptionParameters(data, 'option_1');

  // First tuition
  let firstTuition = FTISCA;
  if (courses.length > 1) {
    firstTuition = FTIMCA;
    specialCases = { ...specialCases, multipleCourses: true };
  }

  let result = [
    ...extraFees,
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: courses[0]?.coursePricing?.course?.name,
      paymentAmount: firstTuition
    }
  ];

  const totalTuitions = [];
  for (const [index, course] of courses.entries()) {
    let { startDate } = course;
    let { tuition_fee } = course?.coursePricing;
    let { name } = course?.coursePricing?.course;
    if (index === courses.length - 1) {
      // Last discount: include amount and percentage
      tuition_fee = discount(tuition_fee, specialCases, true).finalPrice;
    } else {
      // Other discounts: only include percentage
      tuition_fee = discount(tuition_fee, specialCases).finalPrice;
    }
    totalTuitions.push(tuition_fee);
    // Remove amount of the first tuition of the first price
    if (index === 0) {
      tuition_fee -= firstTuition;
    }
    result = [...result, ...generatePaymentsOption1(data, name, startDate, tuition_fee)];
  }

  result = generateTotalPayments(result, totalTuitions);

  return result;
}
