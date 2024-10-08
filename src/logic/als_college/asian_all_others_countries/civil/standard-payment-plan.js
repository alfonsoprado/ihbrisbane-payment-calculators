import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate,
} from "../../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../../helpers/tools";

export function asianAllOthersCountriesStandardPaymentPlanCivil(
  data,
  courses,
  paymentType
) {
  const {
    coe_fee,
    second_tuition_installment_amount,
    third_tuition_installment_amount,
    fourth_tuition_installment_amount,
    third_tuition_installment_n_weeks_after_course_start,
    fourth_tuition_installment_n_weeks_after_course_start,
    last_tuition_installment_n_weeks_after_course_start,
  } = getPaymentOptionParameters(data, paymentType, "single");

  let result = [];

  const courseSelected = courses[0];
  const courseStartDate = courseSelected?.startDate;
  const coursePriceDetails = courseSelected?.coursePricing;
  const courseDetails = coursePriceDetails.course;
  const courseTotalAmountTuitionFee = courseSelected?.tuition;

  courseSelected.discountsApplied = [];

  const secondTuitionInstallmentDate = findFridayOfPreviousWeeks(
    courseStartDate,
    1
  );

  result = [
    ...result,
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: courseDetails?.name,
      paymentAmount: coe_fee,
      code: "tuition_installment",
    },
    {
      // Second tuition: 3 days before friday payment
      dueDate: formatDate(secondTuitionInstallmentDate),
      feeDescription: "Tuition installment",
      courseName: courseDetails?.name,
      paymentAmount: second_tuition_installment_amount,
      code: "tuition_installment",
    },
    {
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          secondTuitionInstallmentDate,
          third_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName: courseDetails?.name,
      feeDescription: "Tuition installment",
      paymentAmount: third_tuition_installment_amount,
      code: "tuition_installment",
    },
    {
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          secondTuitionInstallmentDate,
          fourth_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName: courseDetails?.name,
      feeDescription: "Tuition installment",
      paymentAmount: fourth_tuition_installment_amount,
      code: "tuition_installment",
    },
  ];

  result = [
    ...result,
    {
      dueDate: formatDate(
        findFridayOfFollowingWeeks(
          secondTuitionInstallmentDate,
          last_tuition_installment_n_weeks_after_course_start
        )
      ),
      courseName: courseDetails?.name,
      feeDescription: "Tuition installment",
      paymentAmount:
        courseTotalAmountTuitionFee -
        result.reduce((prev, cur) => {
          return prev + cur?.paymentAmount;
        }, 0),
      code: "tuition_installment",
    },
  ];

  console.log(courses[0]);

  return result;
}
