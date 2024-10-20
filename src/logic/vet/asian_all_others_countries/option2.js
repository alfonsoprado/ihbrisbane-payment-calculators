import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate,
} from "../../../helpers/dates";
import { formatCourse } from "../../../helpers/ihbrisbane";
import { getPaymentOptionParameters } from "../../../helpers/tools";
import { alignExternalPaymentsWithInternalFormat } from "./utils";

function generatePaymentSingleCourse(data, course, paymentType) {
  const { startDate, finalTuition } = course;
  const courseName = formatCourse(course?.coursePricing?.course);

  const parameters = getPaymentOptionParameters(data, paymentType, "single");

  const result = [
    {
      dueDate: formatDate(new Date()),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.first_tuition_installment_percentage,
      code: "tuition_installment",
    },
    {
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.second_tuition_installment_percentage,
      code: "tuition_installment",
    },
    {
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          startDate,
          parameters?.third_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.third_tuition_installment_percentage,
      code: "tuition_installment",
    },
    {
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          startDate,
          parameters?.fourth_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.fourth_tuition_installment_percentage,
      code: "tuition_installment",
    },
  ];

  return result;
}

function generatePaymentMultipleCourses(data, courses, paymentType) {
  const parameters = getPaymentOptionParameters(data, paymentType, "multiple");

  // Stage 1 - Internal & external
  const paymentsS1 = [
    {
      dueDate: formatDate(new Date()),
      courseName: formatCourse(courses[0].coursePricing?.course),
      feeDescription: "Tuition installment",
      paymentAmount: 0,
      code: "tuition_installment",
    },
  ];
  for (const course of courses) {
    const { startDate, finalTuition } = course;
    const courseName = formatCourse(course?.coursePricing?.course);

    paymentsS1[0].paymentAmount +=
      finalTuition * parameters?.first_tuition_installment_percentage;
    paymentsS1.push({
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.second_tuition_installment_percentage,
      code: "tuition_installment",
    });
    paymentsS1.push({
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          startDate,
          parameters?.third_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.third_tuition_installment_percentage,
      code: "tuition_installment",
    });
    paymentsS1.push({
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          startDate,
          parameters?.fourth_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount:
        finalTuition * parameters?.fourth_tuition_installment_percentage,
      code: "tuition_installment",
    });
  }

  // Stage 2 - Only internal payment calculator
  if (data?.payment_calculator?.allow === "internal") {
    const paymentsS2 = alignExternalPaymentsWithInternalFormat(
      paymentsS1,
      courses
    );
    return paymentsS2;
  } else {
    return paymentsS1;
  }
}

export function asianAllOthersCountriesOption2VET(
  data,
  courses,
  paymentType = "option_2"
) {
  let result = [];
  if (courses.length === 1) {
    result = generatePaymentSingleCourse(data, courses[0], paymentType);
  } else {
    result = generatePaymentMultipleCourses(data, courses, paymentType);
  }

  return result;
}
