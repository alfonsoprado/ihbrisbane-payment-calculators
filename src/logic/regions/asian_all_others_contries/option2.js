import {
  findFridayOfPreviousWeeks,
  findFridayOfFollowingWeeks,
  formatDate
} from "../../../helpers/dates";

function generatePaymentSingleCourse(data, course) {
  const { startDate, finalTuition } = course;
  const name = course?.coursePricing?.course?.name;

  const parameters = JSON.parse(data?.payment_options?.find(option => option?.code === 'option_2' && option?.type === 'single')?.parameters);

  const result = [
    {
      dueDate: formatDate(new Date()),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.first_tuition_installment_percentage
    },
    {
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage
    },
    {
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.third_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.third_tuition_installment_percentage
    },
    {
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.fourth_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.fourth_tuition_installment_percentage
    }
  ];

  return result;
}

function generatePaymentMultipleCourses(data, courses) {
  const parameters = JSON.parse(data?.payment_options?.find(option => option?.code === 'option_2' && option?.type === 'multiple')?.parameters);

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
      dueDate: formatDate(findFridayOfPreviousWeeks(startDate, 1)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.second_tuition_installment_percentage
    });
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.third_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.third_tuition_installment_percentage
    });
    paymentsS1.push({
      dueDate: formatDate(findFridayOfFollowingWeeks(startDate, parameters?.fourth_tuition_installment_n_weeks_after_course_start)),
      courseName: name,
      feeDescription: "Tuition installment",
      paymentAmount: finalTuition * parameters?.fourth_tuition_installment_percentage
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

export function option2(data, courses) {
  let result = [];
  if (courses.length === 1) {
    result = generatePaymentSingleCourse(data, courses[0]);
  } 
  else {
    result = generatePaymentMultipleCourses(data, courses);
  }

  return result;
}
