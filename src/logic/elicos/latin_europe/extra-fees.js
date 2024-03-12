import { formatDate } from "../../../helpers/dates";

export function generateExtraFeesLatinAmericaEuropeElicos(data, paymentType, courses, specialCasesSelected) {
  const {
    required_weeks,
    courses_discount
} = JSON.parse(data?.discount_promotions?.find(dp => dp.code === '21_weeks_discount')?.parameters);

  
  let enrolmentFee = 0;
  let materialFee = 0;
  let materialFeeWeeks = 0;

  const totalDurationDayCourses = courses.reduce((prev, cur) => {
    if(cur?.coursePricing?.course?.type !== "day") {
      return prev;
    }
    return prev + parseInt(cur.duration);
  }, 0);

  if(totalDurationDayCourses < required_weeks) {
    for (const course of courses) {
      if(course?.coursePricing?.enrolment_fee > enrolmentFee) {
        enrolmentFee = course?.coursePricing?.enrolment_fee;
      }
  
      if(courses_discount.includes(course?.coursePricing?.course?.cricos_code)) {
        const parameters = JSON.parse(course?.coursePricing?.parameters)
        const weeksDurationLimitCourse = parameters?.material_fee_weeks;
        if(materialFeeWeeks < weeksDurationLimitCourse) {
          let weeksDurationCourse = parseInt(course?.duration);
          weeksDurationCourse = weeksDurationCourse / weeksDurationLimitCourse > 1 ? weeksDurationLimitCourse : weeksDurationCourse;
          const weeks = weeksDurationCourse % (weeksDurationLimitCourse - materialFeeWeeks + 1);
          materialFee += course?.coursePricing?.material_fee * weeks;
          materialFeeWeeks += weeks;
        }
        
      } else if(course?.coursePricing?.course?.cricos_code === "062149K/062148M") {
        materialFee += course?.coursePricing?.material_fee;
      }
    }
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
