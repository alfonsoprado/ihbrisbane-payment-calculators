import { getCourseDiscountPromotion } from "../../../../helpers/tools";

/*
    Do not forget, when applying discounts using percentages, 
    the rule is to use the largest percentage, it is not cumulative. 
    That is, if we have a 5% discount but we also have another discount of 10%, 
    then the final discount is 10%, not 15%.

*/
export function asianAllOthersCountriesDiscountsALSCollege(data, paymentType, courses, specialCases) {
    const discountFirstWeeksCourse = getCourseDiscountPromotion(data, "116125A", "first_weeks_course");
    const datesDFWC = discountFirstWeeksCourse?.parameters?.dates;

    for (const course of courses) {
        course.discountsApplied = [];
        course.finalTuition = course.tuition;

        if(course?.coursePricing?.course?.cricos_code === "116125A" && datesDFWC.includes(course?.startDate)) {
            const totalAmountTuitionFeeDFWC = course?.tuition - discountFirstWeeksCourse?.amount;
            course.finalTuition =  totalAmountTuitionFeeDFWC;
            course.discountsApplied.push(discountFirstWeeksCourse);
        }
    }

    console.debug("Courses after discounts were applied:", courses);
}

