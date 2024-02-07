import { generateExtraFees } from "./extra-fees";
import { option1 } from "./regions/asian_all_others_contries/option1";
import { option2 } from "./regions/asian_all_others_contries/option2";
import { discountsAAOC } from "./regions/asian_all_others_contries/discounts";
import { generateTotalPayments } from "./total";

function addIdToArray(result) {
  return result.map((row, index) => {
    row.id = index;
    return row;
  });
}

/*
    input:
    courses -> [{
      name: "Certificate I in Retail", 
      startDate: "2023-10-30", 
      // duration: "33", 
      price: "5000"
    }]
    paymentType -> option1, option2
    specialCases -> { formalStudent: false, payAtOnce: false }
    
    output: 
    [{
      id: 1,
      dueDate: '30/10/2023',
      feeDescription: 'Payment Plan',
      courseName: '',
      paymentAmount: '$100',
    },
    {
      id: 2,
      dueDate: '30/10/2023',
      feeDescription: 'Tuition',
      courseName: 'Certificate I in Retail',
      paymentAmount: '$500',
    }]
  */
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
    // Modificar result, sacar de parametros y que la funcion retorne solo result
    result = [
      ...result,
      ...option1(data, courses)
    ];
  } else if (paymentType === "option_2") {
    result = [
      ...result,
      ...option2(data, courses)
    ];
  } else {
    throw new Error("Option doesn't exists");
  }
  //termina condicional

  result = [
    ...result,
    ...generateTotalPayments(result, courses)
  ];

  return addIdToArray(result);
}
