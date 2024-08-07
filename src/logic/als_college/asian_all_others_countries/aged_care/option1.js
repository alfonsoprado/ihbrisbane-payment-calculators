import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../../helpers/tools";

function generateCoeFee(data, courses) {
  const {
    coe_fee
  } = getPaymentOptionParameters(data, 'option_1-aged_care', 'both');

  let result = [];

  for (let i = 0; i < courses.length; i++) {
    if (i === 0) {
      result = [
        ...result,
        {
          dueDate: formatDate(new Date()),
          feeDescription: "Tuition installment",
          courseName: courses[i]?.coursePricing?.course?.name,
          paymentAmount: coe_fee?.first,
          code: "tuition_installment"
        }
      ]
    } else {
      result = [
        ...result,
        {
          dueDate: formatDate(new Date()),
          feeDescription: "Tuition installment",
          courseName: courses[i]?.coursePricing?.course?.name,
          paymentAmount: coe_fee?.nth,
          code: "tuition_installment"
        }
      ]
    }
  }

  return result;
}

function generatePaymentOption1AgedCare(data, course, index) {
  const {
    coe_fee,
    paymentOption1AgedCare
  } = getPaymentOptionParameters(data, 'option_1-aged_care', 'both');

  const secondTuitionInstallmentFee = course?.finalTuition * paymentOption1AgedCare?.second_tuition_installment_percentage;
  // Second tuition: 3 days before friday payment
  const secondTuitionInstallmentDate = findFridayOfPreviousWeeks(course?.startDate, 1);

  const thirdTuitionInstallmentFee = course?.finalTuition * paymentOption1AgedCare?.second_tuition_installment_percentage - (index === 0 ? coe_fee?.first : coe_fee?.nth);
  // Third tuition: n weeks after course start date
  const thirdTuitionInstallmentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, paymentOption1AgedCare?.third_tuition_installment_n_weeks_after_course_start);


  const result = [
    {
      dueDate: formatDate(secondTuitionInstallmentDate),
      feeDescription: "Tuition installment",
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: Math.round(secondTuitionInstallmentFee * 10) / 10,
      code: "tuition_installment"
    },
    {
      dueDate: formatDate(thirdTuitionInstallmentDate),
      feeDescription: "Tuition installment",
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: Math.round(thirdTuitionInstallmentFee * 10) / 10,
      code: "tuition_installment"
    }
  ]

  return result;
}

function generatePaymentOption2AgedCare(data, course, index) {
  const {
    coe_fee,
    paymentOption2AgedCare,
  } = getPaymentOptionParameters(data, 'option_1-aged_care', 'both');

  const secondTuitionInstallmentFee = course?.finalTuition * paymentOption2AgedCare?.second_tuition_installment_percentage;
  // Second tuition: 3 days before friday payment
  const secondTuitionInstallmentDate = findFridayOfPreviousWeeks(course?.startDate, 1);

  const thirdTuitionInstallmentFee = course?.finalTuition * paymentOption2AgedCare?.third_tuition_installment_percentage;
  // Third tuition: n weeks after course start date
  const thirdTuitionInstallmentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, paymentOption2AgedCare?.third_tuition_installment_n_weeks_after_course_start);

  const fourthTuitionInstallmentFee = course?.finalTuition - secondTuitionInstallmentFee - thirdTuitionInstallmentFee - (index === 0 ? coe_fee?.first : coe_fee?.nth);
  const fourthTuitionInstallmentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, paymentOption2AgedCare?.fourth_tuition_installment_n_weeks_after_course_start);


  const result = [
    {
      dueDate: formatDate(secondTuitionInstallmentDate),
      feeDescription: "Tuition installment",
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: Math.round(secondTuitionInstallmentFee * 10) / 10,
      code: "tuition_installment"
    },
    {
      dueDate: formatDate(thirdTuitionInstallmentDate),
      feeDescription: "Tuition installment",
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: Math.round(thirdTuitionInstallmentFee * 10) / 10,
      code: "tuition_installment"
    },
    {
      dueDate: formatDate(fourthTuitionInstallmentDate),
      feeDescription: "Tuition installment",
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: Math.round(fourthTuitionInstallmentFee * 10) / 10,
      code: "tuition_installment"
    },
  ]

  return result;
}

export function asianAllOthersCountriesOption1AgedCare(data, courses) {
  const {
    paymentOption1AgedCare,
    paymentOption2AgedCare,
  } = getPaymentOptionParameters(data, 'option_1-aged_care', 'both');

  let result = [
    ...generateCoeFee(data, courses) // First tuition installment
  ];

  for (let i = 0; i < courses.length; i++) {
    const course_code = courses[i]?.coursePricing?.course?.course_code;

    if (paymentOption1AgedCare?.course_codes?.includes(course_code)) {
      result = [
        ...result,
        ...generatePaymentOption1AgedCare(data, courses[i], i)
      ]
    } 
    
    if (paymentOption2AgedCare?.course_codes?.includes(course_code)) {
      result = [
        ...result,
        ...generatePaymentOption2AgedCare(data, courses[i], i)
      ]
    }
  }

  return result;
}
