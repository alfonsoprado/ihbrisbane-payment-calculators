import { getSpecialCases } from "../../../helpers/tools";

export function discountsAAOC(data, courses, specialCases) {
    const allSpecialCasesAvailable = getSpecialCases(data, courses);
    const horticulturePackageSpecial = JSON.parse(data?.course_pricings?.find(cp => cp?.course?.cricos_code === '113194A')?.discount_promotions?.find(dp => dp.code === 'horticulture_package_special')?.parameters)?.courses;
    const horticultureCoursesCricosCodes = Object.keys(horticulturePackageSpecial);
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        // Default finalTuition, change if have discount
        course.finalTuition = course?.coursePricing?.tuition_fee;

        // Extension Student
        if(specialCases.includes('es')) {
            const specialCaseES = allSpecialCasesAvailable?.find(sc => sc?.code === 'es');
            // Last course discount 500
            if(i === courses.length - 1) {
                course.finalTuition -= specialCaseES?.amount;
            }
            // Every course discout 5%
            const discountPercentage = parseFloat(specialCaseES?.percentage);
            course.finalTuition = course.finalTuition * (1 - discountPercentage);
        // Horticulture Package Special
        } else if(courses?.find(item => item?.coursePricing?.course?.cricos_code === '113194A') && courses?.find(item => horticultureCoursesCricosCodes.includes(item?.coursePricing?.course?.cricos_code))) {
            const cricos_code = course?.coursePricing?.course?.cricos_code;
            // It is course in the Horticulture Package Special and is standard course
            if(horticultureCoursesCricosCodes?.includes(cricos_code) && course?.coursePricing?.course?.type === 'standard') {
                // Doesn't exists a course with more weight than the current course 
                if(!courses?.some(item => horticulturePackageSpecial[item?.coursePricing?.course?.cricos_code]?.weight > horticulturePackageSpecial[cricos_code]?.weight)) {
                    course.finalTuition = horticulturePackageSpecial[cricos_code]?.amount;
                } 
            }
        }
        // poner curso doble
    }
    console.log(courses);
    
}