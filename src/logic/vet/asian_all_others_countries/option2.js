import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";
import { alignExternalPaymentsWithInternalFormat } from "./utils";

function generatePaymentSingleCourse(data, course) {
  const { startDate, finalTuition } = course;
  const name = course?.coursePricing?.course?.name;

  const parameters = data?.payment_options?.find(option => option?.code === 'option_2' && option?.type === 'single')?.parameters;

  const result = [
    {
      dueDate: formatDate(new Date()),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.first_tuition_installment_percentage,
      code: "tuition_installment"
    },
    {
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage,
      code: "tuition_installment"
    },
    {
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.third_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.third_tuition_installment_percentage,
      code: "tuition_installment"
    },
    {
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.fourth_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.fourth_tuition_installment_percentage,
      code: "tuition_installment"
    }
  ];

  return result;
}

function generatePaymentMultipleCourses(data, courses) {
  const parameters = data?.payment_options?.find(option => option?.code === 'option_2' && option?.type === 'multiple')?.parameters;

  // Stage 1 - Internal & external
  const paymentsS1 = [
    {
      dueDate: formatDate(new Date()),
      courseName: courses[0].coursePricing?.course?.name,
      feeDescription: "Tuition installment",
      paymentAmount: 0,
      code: "tuition_installment"
    }
  ];
  for (const course of courses) {
    const { startDate, finalTuition } = course;
    const name = course?.coursePricing?.course?.name;

    paymentsS1[0].paymentAmount += finalTuition * parameters?.first_tuition_installment_percentage;
    paymentsS1.push({
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage,
      code: "tuition_installment"
    });
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.third_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.third_tuition_installment_percentage,
      code: "tuition_installment"
    });
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.fourth_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.fourth_tuition_installment_percentage,
      code: "tuition_installment"
    });
  }

  // Stage 2 - Only internal payment calculator
  if (data?.payment_calculator?.allow === 'internal') {
    const paymentsS2 = alignExternalPaymentsWithInternalFormat(paymentsS1, courses);
    return paymentsS2;
  } else {
    return paymentsS1;
  }
}

export function asianAllOthersCountriesOption2VET(data, courses) {
  let result = [];
  if (courses.length === 1) {
    result = generatePaymentSingleCourse(data, courses[0]);
  }
  else {
    result = generatePaymentMultipleCourses(data, courses);
  }

  return result;
}
