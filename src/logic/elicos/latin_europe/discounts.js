export function latinAmericaEuropeDiscountsElicos(data, paymentType, courses, specialCases) {
    let totalDurationDayCourses = 0;
    const {
        required_weeks,
        extra_free_weeks
    } = JSON.parse(data?.discount_promotions?.find(dp => dp.code === '21_weeks_discount')?.parameters);

    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        course.discountsApplied = [];
        course.finalTuition = course?.coursePricing?.tuition_fee * parseInt(course?.duration);
        
        if(course?.coursePricing?.course?.type === 'day') {
            totalDurationDayCourses += parseInt(course?.duration);
        }
    }

    const dayCourse = courses?.find(course => course?.coursePricing?.course?.type === 'day' && course?.duration >= extra_free_weeks);
    if(totalDurationDayCourses >= (required_weeks + extra_free_weeks)) {
        const discount = dayCourse?.coursePricing?.tuition_fee * extra_free_weeks;
        dayCourse.finalTuition -= discount;
        dayCourse.discountsApplied.push(discount);
        console.debug("A discount was applied to:", dayCourse);
    } else if(totalDurationDayCourses > required_weeks) {
        const discount = dayCourse?.coursePricing?.tuition_fee * (totalDurationDayCourses - required_weeks);
        dayCourse.finalTuition -= discount; 
        console.debug("A discount was applied to:", dayCourse);
    }

    console.debug("Courses after discounts were applied:", courses); 
}