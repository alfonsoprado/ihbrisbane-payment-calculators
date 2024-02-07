import { getSpecialCases } from "../../../helpers/tools";

export function discountsAAOC(data, paymentType, courses, specialCases) {
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        // Default finalTuition, change if have discount
        course.finalTuition = course?.coursePricing?.tuition_fee;
        course.discountsApplied = [];
    }
    console.debug("Courses after discounts were applied:", courses); 
}