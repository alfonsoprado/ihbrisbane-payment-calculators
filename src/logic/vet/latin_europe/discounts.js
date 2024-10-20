import { getPaymentCalculatorDiscountPromotion } from "../../../helpers/tools";

export function latinAmericaEuropeDiscountsVET(data, paymentType, courses, specialCases) {
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        // Default finalTuition, change if have discount
        course.finalTuition = course?.tuition;
        course.discountsApplied = [];

        // Discounts
        const multipleCoursesEnable = courses.length > 1;

        // Multiple courses
        if(multipleCoursesEnable) {
            console.debug("Discount: Multiple courses");
            // It is the last course
            if(i === courses.length - 1) {
                const discountPromotionLastCourse = getPaymentCalculatorDiscountPromotion(data,'multi_course_last_discount');
                course.finalTuition -= discountPromotionLastCourse?.amount;
                course.discountsApplied.push(discountPromotionLastCourse);
                console.debug("A discount was applied to:", course);
            }
        }
    }
    console.debug("Courses after discounts were applied:", courses); 
}