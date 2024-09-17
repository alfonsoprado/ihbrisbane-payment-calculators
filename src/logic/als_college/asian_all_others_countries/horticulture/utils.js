export function alignExternalPaymentsWithInternalFormat(paymentsS1, courses) {
    const paymentsS2 = [];
    const tuitions = courses.map((course) => course.finalTuition);
    const names = courses.map((course) => course?.coursePricing?.course?.name);

    let remainder = tuitions.shift();
    let courseName = names.shift();
    for (const payment of paymentsS1) {
      remainder -= payment.paymentAmount;
      if (remainder < 0) {
        if (payment.paymentAmount + remainder !== 0) {
          paymentsS2.push({
            ...payment,
            courseName,
            paymentAmount: payment.paymentAmount + remainder
          });
        }
        courseName = names.shift();
        paymentsS2.push({
          ...payment,
          courseName,
          paymentAmount: Math.abs(remainder)
        });
        remainder += tuitions.shift();
      } else {
        paymentsS2.push({
          ...payment,
          courseName,
        });
      }
    }

    return paymentsS2;
}