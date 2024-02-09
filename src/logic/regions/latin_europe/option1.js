import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../helpers/tools";

function generatePaymentsOption1(data, courseName, startDate, coursePrice) {
  const {
    tuition_installments_amount, // $320
    tuition_installments_interval_weeks // 1 Month = 4 weeks
  } = getPaymentOptionParameters(data, 'option_1');

  const payments = [];

  let remainingAmount = coursePrice;

  // Monthly instalments starting from one week before the course start date
  let paymentDate = findFridayOfPreviousWeeks(startDate, 1);
  // Every month payment
  while (tuition_installments_amount <= remainingAmount) {
    paymentDate = findFridayOfFollowingWeeks(paymentDate, tuition_installments_interval_weeks);
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: tuition_installments_amount
    });
    remainingAmount -= tuition_installments_amount;
  }

  // Last month, if there is a residual payment
  if (remainingAmount !== 0) {
    payments.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(paymentDate, tuition_installments_interval_weeks)),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: remainingAmount
    });
  }

  return payments;
}

export function latinAmericaEuropeOption1(data, courses) {
  const {
    first_tuition_installment_amount // $100 AUS
  } = getPaymentOptionParameters(data, 'option_1');

  // First tuition
  let result = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: courses[0]?.coursePricing?.course?.name,
      paymentAmount: first_tuition_installment_amount
    }
  ];

  for (const [index, course] of courses.entries()) {
    let startDate = course?.startDate;
    let name = course?.coursePricing?.course?.name;
    // Remove amount of the first tuition of the first price
    let tuition_fee = course?.finalTuition;
    if (index === 0) {
      tuition_fee -= first_tuition_installment_amount;
    }
    result = [
      ...result,
      ...generatePaymentsOption1(data, name, startDate, tuition_fee)
    ];
  }

  return result;
}
