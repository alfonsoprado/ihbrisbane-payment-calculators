import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate,
} from "../../../../helpers/dates";
import { formatCourse } from "../../../../helpers/ihbrisbane";
import { getPaymentOptionParameters } from "../../../../helpers/tools";

function generateCoeFee(data, courses) {
  const { coe_fee } = getPaymentOptionParameters(
    data,
    "option_1-horticulture",
    "both"
  );

  let result = [];

  for (let i = 0; i < courses.length; i++) {
    const courseName = formatCourse(courses[i]?.coursePricing?.course);

    if (i === 0) {
      result = [
        ...result,
        {
          dueDate: formatDate(new Date()),
          feeDescription: "Tuition installment",
          courseName,
          paymentAmount: coe_fee?.first,
          code: "tuition_installment",
        },
      ];
    } else {
      result = [
        ...result,
        {
          dueDate: formatDate(new Date()),
          feeDescription: "Tuition installment",
          courseName,
          paymentAmount: coe_fee?.nth,
          code: "tuition_installment",
        },
      ];
    }
  }

  return result;
}

function generatePaymentsOption1(
  data,
  course,
  startDate,
  coursePrice,
  paymentType
) {
  const courseName = formatCourse(course?.coursePricing?.course);

  const {
    tuition_installments_amount: TIA, // $1000 AUS
    third_tuition_installment_n_weeks_after_course_start: TTIWACS, // 10 weeks
    tuition_installments_interval_weeks_after_third_tuition: TIIWATT, // Month = 4 weeks
  } = getPaymentOptionParameters(data, paymentType, "both");

  const payments = [];

  let remainingAmount = coursePrice;

  // Second tuition: 3 days before friday payment
  const secondTuitionInstallmentDate = findFridayOfPreviousWeeks(startDate, 1);
  if (TIA <= remainingAmount) {
    payments.push({
      dueDate: formatDate(secondTuitionInstallmentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA,
      code: "tuition_installment",
    });
    remainingAmount -= TIA;
  }

  let paymentDate = findFridayOfFollowingWeeks(
    secondTuitionInstallmentDate,
    TTIWACS
  );
  if (TIA <= remainingAmount) {
    // Third tuition: n weeks after course start date, n = TTIWACS = 10 weeks
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: TIA,
      code: "tuition_installment",
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
      code: "tuition_installment",
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
      code: "tuition_installment",
    });
  }

  return payments;
}

export function asianAllOthersCountriesOption1Horticulture(
  data,
  courses,
  paymentType
) {
  const { coe_fee } = getPaymentOptionParameters(
    data,
    "option_1-horticulture",
    "both"
  );

  let result = [
    ...generateCoeFee(data, courses), // First tuition installment
  ];

  for (const [index, course] of courses.entries()) {
    let startDate = course?.startDate;
    // Remove amount of the first tuition of the first price
    let tuition_fee = course?.finalTuition;
    if (index === 0) {
      tuition_fee -= coe_fee?.first;
    } else {
      tuition_fee -= coe_fee?.nth;
    }
    result = [
      ...result,
      ...generatePaymentsOption1(
        data,
        course,
        startDate,
        tuition_fee,
        paymentType
      ),
    ];
  }

  return result;
}
