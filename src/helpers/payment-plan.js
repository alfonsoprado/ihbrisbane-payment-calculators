import { generateExtraFees } from "./extra-fees";
import { option1 } from "./option1";
import { option2 } from "./option2";

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
export function generatePaymentPlan(courses, paymentType, specialCases) {
  console.debug("Courses", courses);
  console.debug("Payment Type", paymentType);
  console.debug("Special Cases", specialCases);

  let result = [];
  if (paymentType === "option1") {
    result = option1(courses, specialCases);
  } else if (paymentType === "option2") {
    result = option2(courses, specialCases);
  } else {
    throw new Error("Not option was selected");
  }
  return addIdToArray(result);
}
