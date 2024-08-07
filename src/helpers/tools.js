export function getPaymentOptions(data, selectedCourses) {
    let types = ['single', 'both'];

    if (selectedCourses.length > 1) {
        types = ['multiple', 'both'];
    }

    let payment_options =data?.payment_options?.filter(option => types.includes(option?.type)).sort((a, b) => a.order - b.order);

    if(data?.payment_calculator?.type === "als_college") {
        payment_options = payment_options.filter(option => {
            const parameters = JSON.parse(option?.parameters);
            return option?.code === 'pay_upfront' || selectedCourses.some(course => {
                    return parameters?.show_courses?.includes(course?.coursePricing?.course?.course_code)
            });
        });
    }
    return payment_options;
}

export function getPaymentOptionParameters(data, option, type) {
    return JSON.parse(data?.payment_options?.find(item => item?.code === option && item?.type === type)?.parameters);
}

export function getPaymentCalculatorParameters(data) {
    return JSON.parse(data?.parameters);
}

export function getPaymentCalculatorDiscountPromotion(data, code) {
    const discountPromotion = data?.discount_promotions?.find(dp => dp.code === code);
    return {
        ...discountPromotion,
        parameters: JSON.parse(discountPromotion.parameters)
    };
}

export function getCourseDiscountPromotion(data, courseCricosCode, code) {
    const discountPromotion = data?.course_pricings?.find(cp => cp?.course?.cricos_code === courseCricosCode)?.discount_promotions?.find(dp => dp.code === code);
    return {
        ...discountPromotion,
        parameters: JSON.parse(discountPromotion?.parameters)
    }
}


export function getSpecialCases(data, courses) {
    return [
        ...data?.payment_calculator?.pricing_modifiers,
        ...data?.pricing_modifiers,
        ...courses?.map((course) => course?.coursePricing?.pricing_modifiers).flat()
    ].sort((a, b) => a.order - b.order);
}

export function removeHash() {
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in global.history)
        global.history.pushState("", document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

export function scrollTo(id) {
    removeHash();
    setTimeout(() => {
        window.location.hash = id;
    }, 0);
}

export function formatName(firstName, lastName) {
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    let fullName = [];
    if (firstName) fullName.push(firstName);
    if (lastName) fullName.push(lastName);
    fullName = fullName.join(" ");
    const formattedName = fullName.replace(/ /g, '_');
    return formattedName;
}

export function hasDecimalPart(number) {
    return number % 1 > 0;
}