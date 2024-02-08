import {
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";

export function asianAllOthersCountriesOption3(data, courses) {
  const parameters = JSON.parse(data?.payment_options?.find(option => option?.code === 'option_3' && option?.type === 'multiple')?.parameters);

  // Stage 1 - Internal & external
  const paymentsS1 = [
    {
      dueDate: formatDate(new Date()),
      courseName: courses[0].coursePricing?.course?.name,
      feeDescription: "Tuition installment",
      paymentAmount: 0
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
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage
    });
  }

    // Stage 2 - Only internal
    const paymentsS2 = [];
    const tuitions = courses.map((course) => course.finalTuition);
    let remainder = tuitions.shift();
    for (const payment of paymentsS1) {
      remainder -= payment.paymentAmount;
      if (remainder < 0) {
        paymentsS2.push({
          ...payment,
          paymentAmount: payment.paymentAmount + remainder
        });
        paymentsS2.push({
          ...payment,
          paymentAmount: Math.abs(remainder)
        });
        remainder += tuitions.shift();
      } else {
        paymentsS2.push(payment);
      }
    }

  return paymentsS2;
}



