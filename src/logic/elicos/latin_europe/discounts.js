import { getPaymentCalculatorDiscountPromotion } from "../../../helpers/tools";

export function latinAmericaEuropeDiscountsElicos(data, paymentType, courses, specialCases) {
    let totalDurationDayCourses = 0;
    const discount21Week = getPaymentCalculatorDiscountPromotion(data, '21_weeks_discount');

    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        course.discountsApplied = [];
        course.finalTuition = course?.coursePricing?.tuition_fee * parseInt(course?.duration);
        
        if(course?.coursePricing?.course?.type === 'day') {
            totalDurationDayCourses += parseInt(course?.duration);
        }
    }

    const dayCourse = courses?.find(course => course?.coursePricing?.course?.type === 'day' && course?.duration >= discount21Week.extra_free_weeks);
    if(totalDurationDayCourses >= (discount21Week.required_weeks + discount21Week.extra_free_weeks)) {
        const discount = dayCourse?.coursePricing?.tuition_fee * discount21Week.extra_free_weeks;
        dayCourse.finalTuition -= discount;
        dayCourse.discountsApplied.push(discount21Week);
        console.debug("A discount was applied to:", dayCourse);
    } else if(totalDurationDayCourses > discount21Week.required_weeks) {
        const discount = dayCourse?.coursePricing?.tuition_fee * (totalDurationDayCourses - discount21Week.required_weeks);
        dayCourse.finalTuition -= discount; 
        console.debug("A discount was applied to:", dayCourse);
    }

    console.debug("Courses after discounts were applied:", courses); 
}