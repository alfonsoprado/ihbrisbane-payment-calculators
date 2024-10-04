import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate,
} from "../../../helpers/dates";
import { formatCourse } from "../../../helpers/ihbrisbane";
import { getPaymentOptionParameters } from "../../../helpers/tools";
import { latinAmericaEuropeGenerateExtraFeesAgedCare } from "./extra-fees";

function generatePaymentsOption1(data, course, startDate, coursePrice) {
  const courseName = formatCourse(course?.coursePricing?.course);
  const courseCode = course?.coursePricing?.course?.course_code;

  let {
    aged_care_courses,
    aged_care_first_tuition_installment_amount,
    aged_care_tuition_installments_amount,
    first_tuition_installment_amount,
    tuition_installments_amount,
    tuition_installments_interval_weeks,
    courses,
  } = getPaymentOptionParameters(data, "option_1", "both");

  // Courses with diferent tuition_installments_amount or tuition_installments_interval_weeks
  if (aged_care_courses.includes(courseCode)) {
    first_tuition_installment_amount =
      aged_care_first_tuition_installment_amount;
    tuition_installments_amount = aged_care_tuition_installments_amount;
  } else {
    if (courses[courseCode]?.tuition_installments_amount) {
      tuition_installments_amount =
        courses[courseCode]?.tuition_installments_amount;
    }
    if (courses[courseCode]?.tuition_installments_interval_weeks) {
      tuition_installments_interval_weeks =
        courses[courseCode]?.tuition_installments_interval_weeks;
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
    paymentAmount: aged_care_courses.includes(courseCode)
      ? first_tuition_installment_amount
      : tuition_installments_amount,
    code: "tuition_installment",
  });
  remainingAmount -= aged_care_courses.includes(courseCode)
    ? first_tuition_installment_amount
    : tuition_installments_amount;
  // Every month payment
  while (tuition_installments_amount <= remainingAmount) {
    paymentDate = findFridayOfFollowingWeeks(
      paymentDate,
      tuition_installments_interval_weeks
    );
    payments.push({
      dueDate: formatDate(paymentDate),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: tuition_installments_amount,
      code: "tuition_installment",
    });
    remainingAmount -= tuition_installments_amount;
  }

  // Last month, if there is a residual payment
  if (remainingAmount !== 0) {
    payments.push({
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          paymentDate,
          tuition_installments_interval_weeks
        )
      ),
      courseName,
      feeDescription: "Tuition installment",
      paymentAmount: remainingAmount,
      code: "tuition_installment",
    });
  }

  return payments;
}

export function latinAmericaEuropeOption1AgedCare(
  data,
  paymentType,
  courses,
  specialCasesSelected
) {
  let { coe_fee, aged_care_courses } = getPaymentOptionParameters(
    data,
    "option_1",
    "both"
  );

  let aged_care_courses_selected = 0;

  // First tuition
  let result = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "COE Fee",
      courseName: "",
      paymentAmount: coe_fee,
      code: "coe_fee",
    },
    ...latinAmericaEuropeGenerateExtraFeesAgedCare(
      data,
      paymentType,
      courses,
      specialCasesSelected
    ),
  ];

  for (const course of courses) {
    let startDate = course?.startDate;
    // Remove amount of the first tuition of the first price
    let tuition_fee = course?.finalTuition;
    const courseCode = course?.coursePricing?.course?.course_code;
    const materialFee = course?.coursePricing?.material_fee;

    if (
      aged_care_courses.includes(courseCode) &&
      aged_care_courses_selected === 0
    ) {
      tuition_fee -= coe_fee;
      aged_care_courses_selected += 1;
    }
    result = [
      ...result,
      {
        dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
        feeDescription: "Material Fee",
        courseName: formatCourse(course?.coursePricing?.course),
        paymentAmount: specialCasesSelected?.includes("mw") ? 0 : materialFee,
        code: "material_fee",
      },
      ...generatePaymentsOption1(data, course, startDate, tuition_fee),
    ];
  }

  return result;
}
