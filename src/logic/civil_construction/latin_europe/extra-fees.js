import { findFridayOfPreviousWeeks, formatDate } from "../../../helpers/dates";

export function latinAmericaEuropeGenerateExtraFeesADCCD(data, paymentType, courses, specialCasesSelected) {
  const firstCourse = courses[0];
  // Dates
  const courseStartDate = firstCourse?.startDate;
  const courseSecondPaymentDate = formatDate(findFridayOfPreviousWeeks(courseStartDate, 1));
  // Fees
  const enrolmentFee = firstCourse?.coursePricing?.enrolment_fee;
  const materialFee = firstCourse?.coursePricing?.material_fee;

  let extraFees = [
    {
      dueDate: courseSecondPaymentDate,
      feeDescription: "Enrolment Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('ew') || (specialCasesSelected?.includes('es') && data?.region?.code !== "online") ? 0 : enrolmentFee,
      code: 'enrolment_fee'
    },
    {
      dueDate: courseSecondPaymentDate,
      feeDescription: "Material Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('mw') ? 0 : materialFee,
      code: 'material_fee'
    },
    {
      dueDate: courseSecondPaymentDate,
      feeDescription: "Payment Plan Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('pfw') || paymentType === 'pay_upfront' ? 0 : data?.payment_plan_fee,
      code: 'payment_plan_fee' 
    }
  ];

  return extraFees;
}
