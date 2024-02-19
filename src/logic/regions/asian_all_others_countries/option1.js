import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../helpers/tools";

function generatePaymentsOption1(data, course, startDate, coursePrice) {
  const courseName = course?.coursePricing?.course?.name;

  const {
    tuition_installments_amount: TIA, // $1000 AUS
    third_tuition_installment_n_weeks_after_course_start: TTIWACS, // 10 weeks
    tuition_installments_interval_weeks_after_third_tuition: TIIWATT, // Month = 4 weeks
  } = getPaymentOptionParameters(data, 'option_1');

  const payments = [];

  let remainingAmount = coursePrice;

// Second tuition: 3 days before friday payment
  const secondTuitionInstallmentDate  = findFridayOfPreviousWeeks(startDate, 1);
  if (TIA <= remainingAmount) {
    payments.push({
      dueDate: formatDate(secondTuitionInstallmentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA,
      code: "tuition_installment"
    });
    remainingAmount -= TIA;
  }

  let paymentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, TTIWACS);
  if (TIA <= remainingAmount) {
    // Third tuition: n weeks after course start date, n = TTIWACS = 10 weeks
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA,
      code: "tuition_installment"
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
      paymentAmount: TIA,
      code: "tuition_installment"
    });
    remainingAmount -= TIA;
  }

  // Last month, if there is a residual payment
  if (remainingAmount !== 0) {
    payments.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(paymentDate, TIIWATT)),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: remainingAmount,
      code: "tuition_installment"
    });
  }

  return payments;
}

export function asianAllOthersCountriesOption1(data, courses) {
  const {
    first_tuition_installment_single_course_amount, // $300 AUS
    first_tuition_installment_multiple_courses_amount, // $500 AUS
  } = getPaymentOptionParameters(data, 'option_1');

  // First tuition
  let firstTuitionInstallment = first_tuition_installment_single_course_amount;
  if (courses.length > 1) {
    firstTuitionInstallment = first_tuition_installment_multiple_courses_amount;
  }

  let result = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: courses[0]?.coursePricing?.course?.name,
      paymentAmount: firstTuitionInstallment,
      code: "tuition_installment"
    }
  ];

  for (const [index, course] of courses.entries()) {
    let startDate = course?.startDate;
    // Remove amount of the first tuition of the first price
    let tuition_fee = course?.finalTuition;
    if (index === 0) {
      tuition_fee -= firstTuitionInstallment;
    }
    result = [
      ...result,
      ...generatePaymentsOption1(data, course, startDate, tuition_fee)
    ];
  }



  return result;
}
