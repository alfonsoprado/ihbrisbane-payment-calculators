import { formatDate } from "../../helpers/dates";
import { getSpecialCases } from "../../helpers/tools";

export function generateExtraFeesAgedCare(data, paymentType, courses, specialCasesSelected) {
  let enrolmentFee = courses[0]?.coursePricing?.enrolment_fee;
  let materialFee = 0;
  for (const course of courses) {
    materialFee += course?.coursePricing?.material_fee;
  }

  let extraFees = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Enrolment Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('ew') ? 0 : enrolmentFee,
      code: 'enrolment_fee'
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Material Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('mw') ? 0 : materialFee,
      code: 'material_fee'
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Payment Plan Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('pfw') ? 0 : data?.payment_plan_fee,
      code: 'payment_plan_fee' 
    }
  ];

  return extraFees;
}
