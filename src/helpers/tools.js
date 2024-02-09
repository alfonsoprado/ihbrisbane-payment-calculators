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
