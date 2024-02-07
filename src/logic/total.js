import { formatDate } from "../helpers/dates";

export function generateTotalPayments(result, courses, paymentType) {
  const totalPrice = [
    // Tuitions of each course
    ...courses.map((course, index) => ({
      dueDate: paymentType === 'pay_upfront' ? formatDate(new Date()) : "",
      feeDescription: `Tuition ${index + 1}`,
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: course?.finalTuition
    }))
  ];

  if(paymentType === 'pay_upfront') {
    totalPrice.push({
      dueDate: "",
      feeDescription: "Total",
      courseName: "",
      paymentAmount: result.reduce((prev, row) => prev + row.paymentAmount, 0) + totalPrice.reduce((prev, row) => prev + row.paymentAmount, 0) 
    });
  } else {
    totalPrice.unshift({
      dueDate: "",
      feeDescription: "Total",
      courseName: "",
      paymentAmount: result.reduce((prev, row) => prev + row.paymentAmount, 0)
    });
  }

  return totalPrice;
}
