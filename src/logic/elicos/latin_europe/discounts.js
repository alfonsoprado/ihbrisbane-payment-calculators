import { getPaymentCalculatorDiscountPromotion } from "../../../helpers/tools";

export function latinAmericaEuropeDiscountsElicos(data, paymentType, courses, specialCases) {
    let totalDurationWeeksCourses = 0;
    const discount21Week = getPaymentCalculatorDiscountPromotion(data, '21_weeks_discount')?.parameters;

    for (const course of courses) {
        course.discountsApplied = [];
        course.finalTuition = course.tuition;
        
        if(course?.coursePricing?.course?.type === 'day') {
            totalDurationWeeksCourses += parseInt(course?.duration);
        }
    }

    // 21 + 3 free = 24 
    // 42 + 6 free = 48 
    // 63 + 9 free = 72
    const dayCourse = courses?.find(course => course?.coursePricing?.course?.type === 'day' && course?.duration >= discount21Week.extra_free_weeks);
    if(totalDurationWeeksCourses > discount21Week.required_weeks) {
        let discountedWeeks = 0;

        const completeDiscounts = Math.floor(totalDurationWeeksCourses/ (discount21Week.required_weeks + discount21Week.extra_free_weeks));
        const weeksLefts = totalDurationWeeksCourses -  (discount21Week.required_weeks + discount21Week.extra_free_weeks) * completeDiscounts;
        discountedWeeks += completeDiscounts * discount21Week.extra_free_weeks;
        if(weeksLefts > discount21Week.required_weeks) {
            const partialDiscounts = weeksLefts % discount21Week.required_weeks;
            discountedWeeks += partialDiscounts;
        }

        const discount = dayCourse?.coursePricing?.weekly_tuition_fee * discountedWeeks;
        dayCourse.finalTuition -= discount; 
        console.debug("A discount was applied to:", dayCourse);
    }

    console.debug("Courses after discounts were applied:", courses); 
}