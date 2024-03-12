import {
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";
import { alignExternalPaymentsWithInternalFormat } from "./utils";

export function asianAllOthersCountriesOption3VET(data, courses) {
  const parameters = JSON.parse(data?.payment_options?.find(option => option?.code === 'option_3' && option?.type === 'multiple')?.parameters);

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
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.second_tuition_installment_interval_weeks)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage,
      code: "tuition_installment"
    });
  }

  // Stage 2 - Only internal
  if (data?.payment_calculator?.allow === 'internal') {
    const paymentsS2 = alignExternalPaymentsWithInternalFormat(paymentsS1, courses);
    return paymentsS2;
  } else { 
    return paymentsS1;
  }
}



