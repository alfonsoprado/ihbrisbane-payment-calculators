import { formatDate } from "../../../helpers/dates";
import { getPaymentCalculatorDiscountPromotion } from "../../../helpers/tools";

export function generateExtraFeesLatinAmericaEuropeElicos(
  data,
  paymentType,
  coursesSelected,
  specialCasesSelected
) {
  const discount21Week = getPaymentCalculatorDiscountPromotion(
    data,
    "21_weeks_discount"
  )?.parameters;

  let enrolmentFee = 0;
  let total_weeks_ge_ietls = 0;

  const total_weeks_ge_ietls_day = coursesSelected.reduce((weeks, cs) => {
    if (
      cs?.coursePricing?.course?.type === "day" &&
      ["062145C", "062147A"].includes(cs?.coursePricing?.course?.cricos_code)
    ) {
      return weeks + parseInt(cs?.duration);
    }
    return weeks;
  }, 0);
  if (total_weeks_ge_ietls_day >= discount21Week.required_weeks) {
    total_weeks_ge_ietls = 0;
  } else {
    total_weeks_ge_ietls += total_weeks_ge_ietls_day;
  }
  console.log("total_weeks_ge_ietls", total_weeks_ge_ietls);

  const total_weeks_ge_ietls_evening = coursesSelected.reduce((weeks, cs) => {
    if (
      cs?.coursePricing?.course?.type === "evening" &&
      ["062145C", "062147A"].includes(cs?.coursePricing?.course?.cricos_code)
    ) {
      return weeks + parseInt(cs?.duration);
    }
    return weeks;
  }, 0);
  console.log("total_weeks_ge_ietls_evening", total_weeks_ge_ietls_evening);
  total_weeks_ge_ietls += total_weeks_ge_ietls_evening;
  if (total_weeks_ge_ietls >= 24) {
    total_weeks_ge_ietls = 24;
  }
  console.log("total_weeks_ge_ietls", total_weeks_ge_ietls);

  const total_fee_cambridge = coursesSelected.reduce((fee, cs) => {
    if (cs?.coursePricing?.course?.cricos_code === "062149K/062148M") {
      return fee + cs?.coursePricing?.material_fee;
    }
    return fee;
  }, 0);

  const materialFee = total_fee_cambridge + total_weeks_ge_ietls * 18;

  let extraFees = [
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Enrolment Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes("ew") ? 0 : enrolmentFee,
      code: "enrolment_fee",
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Material Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes("mw") ? 0 : materialFee,
      code: "material_fee",
    },
    {
      dueDate: formatDate(new Date()),
      feeDescription: "Payment Plan Fee",
      courseName: "",
      paymentAmount: specialCasesSelected?.includes("pfw")
        ? 0
        : data?.payment_plan_fee,
      code: "payment_plan_fee",
    },
  ];

  return extraFees;
}
