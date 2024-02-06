export function generateTotalPayments(result, totalTuitions) {
  return [
    ...result,
    // Total price
    {
      dueDate: "",
      feeDescription: "Total",
      courseName: "",
      paymentAmount: result.reduce((prev, row) => prev + row.paymentAmount, 0)
    },
    // Tuitions of each course
    ...totalTuitions.map((tuition, index) => ({
      dueDate: "",
      feeDescription: `Tuition ${index + 1}`,
      courseName: "",
      paymentAmount: tuition
    }))
  ];
}
