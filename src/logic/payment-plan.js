import { generateExtraFees } from "./extra-fees";
import { option1 } from "./regions/asian_all_others_contries/option1";
import { option2 } from "./regions/asian_all_others_contries/option2";
import { option3 } from "./regions/asian_all_others_contries/option3";
import { discountsAAOC } from "./regions/asian_all_others_contries/discounts";
import { generateTotalPayments } from "./total";

function addIdToArray(result) {
  return result.map((row, index) => {
    row.id = index;
    return row;
  });
}

export function generatePaymentPlan(data, courses, paymentType, specialCases) {
  console.debug("Data", data);
  console.debug("Courses", courses);
  console.debug("Payment Type", paymentType);
  console.debug("Special Cases", specialCases);

  // Condicional aqui por regiones -> regiones tiene codigo
  discountsAAOC(data, paymentType, courses, specialCases);
  // Termina condicional

  let result = [
    ...generateExtraFees(data, courses, specialCases)
  ];

  // Condicional aqui por regiones
  if (paymentType === "option_1") {
    result = [
      ...result,
      ...option1(data, courses)
    ];
  } else if (paymentType === "option_2") {
    result = [
      ...result,
      ...option2(data, courses)
    ];
  } else if (paymentType === "option_3") {
    result = [
      ...result,
      ...option3(data, courses)
    ];
  }
  //termina condicional

  result = [
    ...result,
    ...generateTotalPayments(result, courses, paymentType)
  ];

  return addIdToArray(result);
}
