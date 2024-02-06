export function getOptionParameters(data, option) {
    return JSON.parse(data?.payment_options.find(item => item.code === option)?.parameters);
}

export function getSpecialCases(data, courses) {
    return [
        ...data?.payment_calculator?.pricing_modifiers,
        ...data?.pricing_modifiers,
        ...courses?.map((course) => course?.coursePricing?.pricing_modifiers).flat()
    ];
}

export function getPaymentOptions(data) {
    return Array.from(new Map(data?.payment_options?.map(obj => [obj.code, { name: obj.name, code: obj.code, order: obj.order }])).values()).sort((a, b) => a.order - b.order)
}