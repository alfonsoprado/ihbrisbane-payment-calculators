/*
  After conducting various tests, the cumulative discount proves to be the best option
  because it results in fewer losses for the business. It is also crucial when dealing 
  with fixed discounts (not percentages) to first deduct these from the total value, 
  and then apply the percentage discounts to the adjusted total.
*/
export function discount(price, specialCases, lastCourse = false) {
  const discount = {
    percent: { type: "No discount", value: 0 },
    amount: { type: "No discount", value: 0 },
    finalPrice: price,
    value: 0
  };
  if (specialCases?.formalStudent) {
    discount.percent = {
      type: "Formal Student",
      value: 0.05
    };
    if (lastCourse) {
      discount.amount = {
        type: "Formal Student",
        value: 500
      };
    }
  } else if (specialCases?.multipleCourses) {
    if (lastCourse) {
      discount.amount = {
        type: "Multiple Courses",
        value: 300
      };
    }
  }

  if (specialCases?.payAtOnce) {
    discount.percent = {
      type: "Pay at once",
      value: 0.1
    };
  }
  console.debug("Discounts", discount);

  discount.finalPrice =
    (price - discount?.amount?.value) * (1 - discount?.percent?.value);
  discount.value = price - discount.finalPrice;
  return discount;
}
