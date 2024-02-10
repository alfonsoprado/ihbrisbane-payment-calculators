import { formatDate } from "../helpers/dates";
import { getSpecialCases } from "../helpers/tools";

export function generateExtraFees(data, paymentType, courses, specialCasesSelected) {
  const allSpecialCasesAvailable = getSpecialCases(data, courses);
  let enrolmentFee = 0;
  let materialFee = 0;
  for (const course of courses) {
    if(course?.coursePricing?.enrolment_fee > enrolmentFee) {
      enrolmentFee = course?.coursePricing?.enrolment_fee;
    }
    if(course?.coursePricing?.material_fee > materialFee) {
      materialFee = course?.coursePricing?.material_fee;
    }
  }

  let extraFees = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Enrolment Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('ew') || (specialCasesSelected?.includes('es') && data?.region?.code !== "open_vet") ? 0 : enrolmentFee,
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
      paymentAmount: specialCasesSelected?.includes('pfw') || paymentType === 'pay_upfront' ? 0 : data?.payment_plan_fee,
      code: 'payment_plan_fee' 
    }
  ];

  if(specialCasesSelected?.includes('ppe')) {
    extraFees = [
      ...extraFees,
      {
        dueDate: formatDate(new Date()),
        feeDescription: "Personal Protective Equiment",
        courseName: "",
        paymentAmount: allSpecialCasesAvailable?.find(sc => sc?.code === 'ppe')?.value,
        code: 'personal_protective_equiment' 
      }
    ]
  }
  return extraFees;
}
