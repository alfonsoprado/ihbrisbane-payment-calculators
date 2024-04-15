import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../helpers/dates";
import { getPaymentOptionParameters } from "../../helpers/tools";

function generateCoeFee(data, courses) {
  const {
    coe_fee
  } = getPaymentOptionParameters(data, 'option_1', 'both');

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

function generatePaymentType1(data, course, index) {
  const {
    coe_fee,
    paymentType1
  } = getPaymentOptionParameters(data, 'option_1', 'both');

  const secondTuitionInstallmentFee = course?.finalTuition * paymentType1?.second_tuition_installment_percentage;
  // Second tuition: 3 days before friday payment
  const secondTuitionInstallmentDate = findFridayOfPreviousWeeks(course?.startDate, 1);

  const thirdTuitionInstallmentFee = course?.finalTuition * paymentType1?.second_tuition_installment_percentage - (index === 0 ? coe_fee?.first : coe_fee?.nth);
  // Third tuition: n weeks after course start date
  const thirdTuitionInstallmentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, paymentType1?.third_tuition_installment_n_weeks_after_course_start);


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

function generatePaymentType2(data, course, index) {
  const {
    coe_fee,
    paymentType2,
  } = getPaymentOptionParameters(data, 'option_1', 'both');

  const secondTuitionInstallmentFee = course?.finalTuition * paymentType2?.second_tuition_installment_percentage;
  // Second tuition: 3 days before friday payment
  const secondTuitionInstallmentDate = findFridayOfPreviousWeeks(course?.startDate, 1);

  const thirdTuitionInstallmentFee = course?.finalTuition * paymentType2?.third_tuition_installment_percentage;
  // Third tuition: n weeks after course start date
  const thirdTuitionInstallmentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, paymentType2?.third_tuition_installment_n_weeks_after_course_start);

  const fourthTuitionInstallmentFee = course?.finalTuition - secondTuitionInstallmentFee - thirdTuitionInstallmentFee - (index === 0 ? coe_fee?.first : coe_fee?.nth);
  const fourthTuitionInstallmentDate = findFridayOfFollowingWeeks(secondTuitionInstallmentDate, paymentType2?.fourth_tuition_installment_n_weeks_after_course_start);


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

export function option1AgedCare(data, courses) {
  const {
    paymentType1,
    paymentType2,
  } = getPaymentOptionParameters(data, 'option_1', 'both');

  let result = [
    ...generateCoeFee(data, courses) // First tuition installment
  ];

  for (let i = 0; i < courses.length; i++) {
    const course_code = courses[i]?.coursePricing?.course?.course_code;

    if (paymentType1?.course_codes?.includes(course_code)) {
      result = [
        ...result,
        ...generatePaymentType1(data, courses[i], i)
      ]
    }

    if (paymentType2?.course_codes?.includes(course_code)) {
      result = [
        ...result,
        ...generatePaymentType2(data, courses[i], i)
      ]
    }
  }

  return result;
}
