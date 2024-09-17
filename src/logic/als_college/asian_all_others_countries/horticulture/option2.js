import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../../helpers/tools";
import { alignExternalPaymentsWithInternalFormat } from "./utils";

function generatePaymentSingleCourse(data, course, paymentType) {
  const { startDate, finalTuition } = course;
  const name = course?.coursePricing?.course?.name;

  const parameters = getPaymentOptionParameters(data, paymentType, 'single');

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

function generatePaymentMultipleCourses(data, courses, paymentType) {
  const parameters = getPaymentOptionParameters(data, paymentType, 'multiple');

  // Stage 1 - Internal & external
  const paymentsS1 = [
    {
      dueDate: formatDate(new Date()),
      courseName: courses[0].coursePricing?.course?.name,
      feeDescription: "Tuition installment",
      paymentAmount: 0,
      code: "tuition_installment"
    },
  ];

  
  for (const [index, course] of courses.entries()) {
    let { startDate, finalTuition } = course;
    if(index > 0) {
      finalTuition -= parameters?.coe_fee;
    }
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

  let result = paymentsS1;
  // Stage 2 - Only internal payment calculator
  if (data?.payment_calculator?.allow === 'internal') {
    const paymentsS2 = alignExternalPaymentsWithInternalFormat(paymentsS1, courses);
    result = paymentsS2;
  } 

  result.splice(1, 0, ...courses.slice(1).map(course => {
    return {
      dueDate: formatDate(new Date()),
      courseName:course.coursePricing?.course?.name,
      feeDescription: "Tuition installment",
      paymentAmount: parameters?.coe_fee,
      code: "tuition_installment"
    };
  }));

  return result;
}

export function asianAllOthersCountriesOption2Horticulture(data, courses, paymentType = 'option_2') {
  let result = [];
  if (courses.length === 1) {
    result = generatePaymentSingleCourse(data, courses[0], paymentType);
  }
  else {
    result = generatePaymentMultipleCourses(data, courses, paymentType);
  }

  return result;
}
