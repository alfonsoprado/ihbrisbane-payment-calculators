import {
  getPaymentCalculatorDiscountPromotion,
  getSpecialCases,
} from "../../../../helpers/tools";

/*
    Do not forget, when applying discounts using percentages, 
    the rule is to use the largest percentage, it is not cumulative. 
    That is, if we have a 5% discount but we also have another discount of 10%, 
    then the final discount is 10%, not 15%.

*/
export function asianAllOthersCountriesDiscountsCivil(
  data,
  paymentType,
  courses,
  specialCases
) {
  const allSpecialCasesAvailable = getSpecialCases(data, courses);

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    // Default finalTuition, change if have discount
    course.finalTuition = course?.tuition;
    course.discountsApplied = [];

    // Discounts
    const extensionStudentEnable = specialCases.includes("es");
    const payUpfrontEnable = paymentType === "pay_upfront";

    // Extension Student
    if (extensionStudentEnable && !payUpfrontEnable) {
      console.debug("Discount: Extension Student");
      const specialCaseES = allSpecialCasesAvailable?.find(
        (sc) => sc?.code === "es"
      );
      // Every course
      const discountPercentage = parseFloat(specialCaseES?.percentage);
      course.finalTuition = course.finalTuition * (1 - discountPercentage);
      course.discountsApplied.push(specialCaseES);
      console.debug("A discount was applied to:", course);
    }

    if (payUpfrontEnable) {
      console.debug("PaymentType: Pay upfront");
      const discountPromotionLastCourse = getPaymentCalculatorDiscountPromotion(
        data,
        "pay_upfront_discount"
      );
      const discountPercentage = discountPromotionLastCourse.percentage;
      course.finalTuition = course.finalTuition * (1 - discountPercentage);
      course.discountsApplied.push(discountPromotionLastCourse);
      console.debug("A discount was applied to:", course);
    }
  }
  console.debug("Courses after discounts were applied:", courses);
}
