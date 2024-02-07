export function generateTotalPayments(result, courses) {
  return [
    // Total price
    {
      dueDate: "",
      feeDescription: "Total",
      courseName: "",
      paymentAmount: result.reduce((prev, row) => prev + row.paymentAmount, 0)
    },
    // Tuitions of each course
    ...courses.map((course, index) => ({
      dueDate: "",
      feeDescription: `Tuition ${index + 1}`,
      courseName: course?.coursePricing?.course?.name,
      paymentAmount: course?.finalTuition
    }))
  ];
}
