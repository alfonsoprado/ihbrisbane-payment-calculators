import { formatDate } from "./dates";

export function generateExtraFees() {
  return [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Enrolment",
      courseName: "",
      paymentAmount: 100
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Material",
      courseName: "",
      paymentAmount: 0
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Payment Plan",
      courseName: "",
      paymentAmount: 100
    }
  ];
}
