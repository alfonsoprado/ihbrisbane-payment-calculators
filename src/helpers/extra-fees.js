import { formatDate } from "./dates";
import { getSpecialCases } from "./tools";

export function generateExtraFees(data, courses, specialCasesSelected) {
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
      paymentAmount: specialCasesSelected?.includes('ew') ? allSpecialCasesAvailable?.find(sc => sc?.code === 'ew')?.value : enrolmentFee 
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Material Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('mw') ? allSpecialCasesAvailable?.find(sc => sc?.code === 'mw')?.value : materialFee 
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Payment Plan Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes('pfw') ? allSpecialCasesAvailable?.find(sc => sc?.code === 'pfw')?.value : data?.payment_plan_fee 
    }
  ];

  if(specialCasesSelected?.includes('ppe')) {
    extraFees = [
      ...extraFees,
      {
        dueDate: formatDate(new Date()),
        feeDescription: "Personal Protective Equiment",
        courseName: "",
        paymentAmount: allSpecialCasesAvailable?.find(sc => sc?.code === 'ppe')?.value 
      }
    ]
  }
  return extraFees;
}
