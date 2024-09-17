import {
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../../helpers/dates";
import { getPaymentOptionParameters } from "../../../../helpers/tools";
import { alignExternalPaymentsWithInternalFormat } from "./utils";

export function asianAllOthersCountriesOption3Horticulture(data, courses, paymentType = 'option_3') {
  const parameters = getPaymentOptionParameters(data, paymentType, 'multiple');

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
  for (const [index, course] of courses.entries()) {
    let { startDate, finalTuition } = course;
    if(index > 0) {
      finalTuition -= parameters?.coe_fee;
    }
    
    const name = course?.coursePricing?.course?.name;

    paymentsS1[0].paymentAmount += finalTuition * parameters?.first_tuition_installment_percentage;
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.second_tuition_installment_interval_weeks)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage,
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



