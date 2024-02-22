import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../helpers/tools";

function generatePaymentsOption1(data, course, startDate, coursePrice) {
  const courseName = course?.coursePricing?.course?.name;
  const courseCode = course?.coursePricing?.course?.course_code;

  let {
    tuition_installments_amount, // $320
    tuition_installments_interval_weeks, // 1 Month = 4 weeks
    courses,
  } = getPaymentOptionParameters(data, 'option_1');

  // Courses with diferent tuition_installments_amount or tuition_installments_interval_weeks
  if (courses && Object.keys(courses).includes(courseCode)) {
    console.log(courses[courseCode]);
    if(courses[courseCode]?.tuition_installments_amount) {
      tuition_installments_amount = courses[courseCode]?.tuition_installments_amount;
    }
    if(courses[courseCode]?.tuition_installments_interval_weeks) {
      tuition_installments_interval_weeks = courses[courseCode]?.tuition_installments_interval_weeks;
    }
  }

  const payments = [];

  let remainingAmount = coursePrice;

  // Monthly instalments starting from one week before the course start date
  let paymentDate = findFridayOfPreviousWeeks(startDate, 1);
  payments.push({
    dueDate: formatDate(paymentDate),
    courseName,
    feeDescription: "Tuition installment",
    paymentAmount: tuition_installments_amount,
    code: "tuition_installment"
  });
  remainingAmount -= tuition_installments_amount;
  // Every month payment
  while (tuition_installments_amount <= remainingAmount) {
    paymentDate = findFridayOfFollowingWeeks(paymentDate, tuition_installments_interval_weeks);
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: tuition_installments_amount,
      code: "tuition_installment"
    });
    remainingAmount -= tuition_installments_amount;
  }

  // Last month, if there is a residual payment
  if (remainingAmount !== 0) {
    payments.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(paymentDate, tuition_installments_interval_weeks)),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: remainingAmount,
      code: "tuition_installment"
    });
  }

  return payments;
}

export function latinAmericaEuropeOption1VET(data, courses) {
  const {
    first_tuition_installment_amount // $100 AUS
  } = getPaymentOptionParameters(data, 'option_1');

  // First tuition
  let result = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: courses[0]?.coursePricing?.course?.name,
      paymentAmount: first_tuition_installment_amount,
      code: "tuition_installment"
    }
  ];

  for (const [index, course] of courses.entries()) {
    let startDate = course?.startDate;
    // Remove amount of the first tuition of the first price
    let tuition_fee = course?.finalTuition;
    if (index === 0) {
      tuition_fee -= first_tuition_installment_amount;
    }
    result = [
      ...result,
      ...generatePaymentsOption1(data, course, startDate, tuition_fee)
    ];
  }

  return result;
}
