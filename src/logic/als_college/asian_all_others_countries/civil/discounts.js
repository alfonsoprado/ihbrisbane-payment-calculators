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
  for (const course of courses) {
    course.discountsApplied = [];
    course.finalTuition = course.tuition;
  }

  console.debug("Courses after discounts were applied:", courses);
}
