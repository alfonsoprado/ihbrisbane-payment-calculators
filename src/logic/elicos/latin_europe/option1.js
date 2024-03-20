import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";
import {
  subWeeks,
  differenceInWeeks,
  parse
} from "date-fns";
import { getPaymentOptionParameters, hasDecimalPart } from "../../../helpers/tools";

export function latinAmericaEuropeOption1Elicos(data, courses) {
  const {
    first_tuition_installment_weeks,
    second_tuition_installment_weeks, 
    tuition_installments_interval_weeks,
    weeks_before_course_end_for_payment
  } = getPaymentOptionParameters(data, 'option_1', 'both');

  const firstCourse = courses[0];

  const courseWeeklyTuitionFee = firstCourse.coursePricing?.weekly_tuition_fee;
  const courseStartDate = parse(firstCourse?.startDate, "yyyy-MM-dd", new Date());
  const lastCourseEndDate = parse(courses[courses.length - 1]?.finishDate, "yyyy-MM-dd", new Date());
  const paymentBeforeStartCourse = findFridayOfPreviousWeeks(courseStartDate, 1);
  const payBeforeThan = subWeeks(lastCourseEndDate, weeks_before_course_end_for_payment);
  const paymentWeeks = differenceInWeeks(payBeforeThan, paymentBeforeStartCourse);
  
  const numberOfPayments = Math.floor(paymentWeeks / tuition_installments_interval_weeks);

  const coursesPrice = courses.reduce((prev, cur) => {
    return prev + cur?.finalTuition;
  }, 0);

  const firstTuition = first_tuition_installment_weeks * courseWeeklyTuitionFee;

  let secondTuition;
  let amountPerTuition;
  if (numberOfPayments === 0) {
    secondTuition = coursesPrice - firstTuition;
  } else {
    secondTuition = second_tuition_installment_weeks * courseWeeklyTuitionFee;
    amountPerTuition = (coursesPrice - firstTuition - secondTuition) / numberOfPayments;
  }

  // First tuition
  let result = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Tuition installment",
      courseName: "",
      paymentAmount: firstTuition,
      code: "tuition_installment"
    }
  ];

  // Second tuition
  let paymentDate = paymentBeforeStartCourse;
  result = [
    ...result,
    {
      dueDate: formatDate(paymentDate),
      feeDescription: "Tuition installment",
      courseName: "",
      paymentAmount: secondTuition,
      code: "tuition_installment"
    }
  ];

  const numberHasDecimalPart = hasDecimalPart(amountPerTuition); 
  for (let i = 0; i < numberOfPayments; i++) {
    paymentDate = findFridayOfFollowingWeeks(paymentDate, tuition_installments_interval_weeks);
    let _amountPerTuition = Math.trunc(amountPerTuition);
    if(numberHasDecimalPart && i === (numberOfPayments - 1)) {
        _amountPerTuition += 1;
    }

    result = [
      ...result,
      {
        dueDate: formatDate(paymentDate),
        feeDescription: "Tuition installment",
        courseName: "",
        paymentAmount: _amountPerTuition,
        code: "tuition_installment"
      }
    ];
  }

  return result;
}
