export function minimumInstallmentThreshold(data, rows) {
    const minimum_installment_tuition_threshold = data?.payment_calculator?.minimum_installment_tuition_threshold;
    console.log("mitt", minimum_installment_tuition_threshold);
    const result = [];
    for (let i = 0; i < rows.length; i++) {
        if(rows[i]?.code === "tuition_installment") {
            if(rows[i-1]?.code === "tuition_installment" && rows[i].paymentAmount < minimum_installment_tuition_threshold) {
                rows[i-1].paymentAmount += rows[i].paymentAmount;
            } else {
                result.push(rows[i]); 
            }
        } else {
            result.push(rows[i]);
        }
    }
    return result;
}