import { formatDate } from "../../../helpers/dates";

export function latinAmericaEuropeGenerateExtraFeesAgedCare(data, paymentType, courses, specialCasesSelected) {
  let enrolmentFee = courses[0]?.coursePricing?.enrolment_fee;

  let extraFees = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Enrolment Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('ew') || specialCasesSelected?.includes('es') ? 0 : enrolmentFee,
      code: 'enrolment_fee'
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Payment Plan Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('pfw') || paymentType === 'pay_upfront' ? 0 : data?.payment_plan_fee,
      code: 'payment_plan_fee' 
    }
  ];

  return extraFees;
}
