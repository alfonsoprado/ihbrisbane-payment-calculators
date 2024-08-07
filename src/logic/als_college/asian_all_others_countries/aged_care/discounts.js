/*
    Do not forget, when applying discounts using percentages, 
    the rule is to use the largest percentage, it is not cumulative. 
    That is, if we have a 5% discount but we also have another discount of 10%, 
    then the final discount is 10%, not 15%.

*/
export function asianAllOthersCountriesDiscountsAgedCare(data, paymentType, courses, specialCases) {
    // Don't have discounts
    console.debug("Courses after discounts were applied:", courses);

    for (const course of courses) {
        course.discountsApplied = [];
        course.finalTuition = course.tuition;
    }
}

