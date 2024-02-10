import { formatDate } from "../helpers/dates";

export function generateTotalPayments(data, result, courses, paymentType) {
  const coursesTuitions = [
    // Tuitions of each course
    ...courses.map((course, index) => ({
      dueDate: paymentType === 'pay_upfront' ? formatDate(new Date()) : "",
      feeDescription: `Tuition ${index + 1}`,
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: course?.finalTuition,
      code: 'tuition'
    }))
  ];

  let total = {
    dueDate: "",
    feeDescription: "Total",
    courseName: "",
    paymentAmount: result.reduce((prev, row) => prev + row.paymentAmount, 0),
    code: 'total'
  };
  if(paymentType === 'pay_upfront') {
    return [
      ...coursesTuitions,
      {
        dueDate: "",
        feeDescription: "Total",
        courseName: "",
        paymentAmount: result.reduce((prev, row) => prev + row.paymentAmount, 0) + coursesTuitions.reduce((prev, row) => prev + row.paymentAmount, 0),
        code: 'total' 
      }
    ];
  }

  if (data?.payment_calculator?.type === 'external') {
    return [
      total
    ];
  }

  return [
    total,
    ...coursesTuitions
  ];
}
