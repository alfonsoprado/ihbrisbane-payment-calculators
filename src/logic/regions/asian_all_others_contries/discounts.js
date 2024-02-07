import { getSpecialCases } from "../../../helpers/tools";

export function discountsAAOC(data, paymentType, courses, specialCases) {
    const allSpecialCasesAvailable = getSpecialCases(data, courses);
    const horticulturePackageSpecial = JSON.parse(data?.course_pricings?.find(cp => cp?.course?.cricos_code === '113194A')?.discount_promotions?.find(dp => dp.code === 'horticulture_package_special')?.parameters)?.courses;
    const horticultureCoursesCricosCodes = Object.keys(horticulturePackageSpecial);

    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        // Default finalTuition, change if have discount
        course.finalTuition = course?.coursePricing?.tuition_fee;
        course.discountsApplied = [];

        // Discounts
        const extensionStudentEnable = specialCases.includes('es');
        const horticulturePackageSpecialEnable = courses?.find(item => item?.coursePricing?.course?.cricos_code === '113194A') && courses?.find(item => horticultureCoursesCricosCodes.includes(item?.coursePricing?.course?.cricos_code) && item?.coursePricing?.course?.type === 'standard');
        const multipleCoursesEnable = courses.length > 1;
        const payUpfrontEnable = paymentType === 'pay_upfront';

        // Extension Student
        if(extensionStudentEnable) {
            console.debug("Discount: Extension Student");
            const specialCaseES = allSpecialCasesAvailable?.find(sc => sc?.code === 'es');
            // Every course
            const discountPercentage = parseFloat(specialCaseES?.percentage);
            course.finalTuition = course.finalTuition * (1 - discountPercentage);
            course.discountsApplied.push(specialCaseES);
            console.debug("A discount was applied to:", course);
        } 

        // Multiple courses
        if(multipleCoursesEnable && (!horticulturePackageSpecialEnable || payUpfrontEnable)) {
            console.debug("Discount: Multiple courses");
            // It is the last course
            if(i === courses.length - 1) {
                const discountPromotionLastCourse = data?.discount_promotions?.find(d => d?.code === 'multi_course_last_discount');
                course.finalTuition -= discountPromotionLastCourse?.amount;
                course.discountsApplied.push(discountPromotionLastCourse);
                console.debug("A discount was applied to:", course);
            }
        }
        
        // Horticulture Package Special
        if(horticulturePackageSpecialEnable && !extensionStudentEnable && !payUpfrontEnable) {
            console.debug("Discount: Horticulture Package Special");
            const cricos_code = course?.coursePricing?.course?.cricos_code;
            // It is course in the Horticulture Package Special and is standard course
            if(horticultureCoursesCricosCodes?.includes(cricos_code) && course?.coursePricing?.course?.type === 'standard') {
                // Doesn't exists a course with more weight than the current course 
                if(!courses?.some(item => horticulturePackageSpecial[item?.coursePricing?.course?.cricos_code]?.weight > horticulturePackageSpecial[cricos_code]?.weight)) {
                    course.finalTuition = horticulturePackageSpecial[cricos_code]?.value;
                    course.discountsApplied.push(horticulturePackageSpecial[cricos_code]);
                    console.debug("A discount was applied to:", course);
                } 
            }
        }

        // PaymentType: Pay upfront and 2 course o more
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