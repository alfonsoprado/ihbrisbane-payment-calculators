import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../../helpers/tools";

function generatePaymentsOption1(data, course, startDate, coursePrice, paymentType) {
  const courseName = course?.coursePricing?.course?.name;

  const {
    tuition_installments_amount: TIA, 
    tuition_installments_interval_weeks_after_third_tuition: TIIWATT, 
  } = getPaymentOptionParameters(data, paymentType, 'both');

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

  let paymentDate = secondTuitionInstallmentDate;
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

export function asianAllOthersCountriesOption1Civil(data, courses, paymentType = 'option_1') {
  const {
    coe_fee
  } = getPaymentOptionParameters(data, paymentType, 'both');

  // First tuition
  let firstTuitionInstallment = coe_fee;

  let result = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: courses[0]?.coursePricing?.course?.name,
      paymentAmount: firstTuitionInstallment,
      code: "tuition_installment"
    }
  ];

  let startDate = courses[0]?.startDate;
  // Remove amount of the first tuition of the first price
  let tuition_fee = courses[0]?.finalTuition - firstTuitionInstallment;

  result = [
    ...result,
    ...generatePaymentsOption1(data, courses[0], startDate, tuition_fee, paymentType)
  ];


  return result;
}