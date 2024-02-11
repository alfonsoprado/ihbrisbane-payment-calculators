export function getPaymentOptions(data, plural = false) {
    let types = ['single', 'both'];
    if (plural) {
        types = ['multiple', 'both'];
    }
    return data?.payment_options?.filter(option => types.includes(option?.type)).sort((a, b) => a.order - b.order);
}

export function getPaymentOptionParameters(data, option) {
    return JSON.parse(data?.payment_options.find(item => item.code === option)?.parameters);
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