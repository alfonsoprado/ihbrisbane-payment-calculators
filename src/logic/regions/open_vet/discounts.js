import { getSpecialCases } from "../../../helpers/tools";

export function openVetDiscounts(data, paymentType, courses, specialCases) {
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        // Default finalTuition, change if have discount
        course.finalTuition = course?.coursePricing?.tuition_fee;
        course.discountsApplied = [];

        const payUpfrontEnable = paymentType === 'pay_upfront';
        if(payUpfrontEnable && courses.length > 1) {
            console.debug("PaymentType: Pay upfront");
            const discountPromotionLastCourse = data?.discount_promotions?.find(d => d?.code === 'pay_upfront_discount');
            const discountPercentage = discountPromotionLastCourse.percentage;
            course.finalTuition = course.finalTuition * (1 - discountPercentage);
            course.discountsApplied.push(discountPromotionLastCourse);
            console.debug("A discount was applied to:", course);
        }
    }
    console.debug("Courses after discounts were applied:", courses); 
}