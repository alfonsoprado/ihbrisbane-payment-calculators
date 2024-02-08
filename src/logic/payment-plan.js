import { generateExtraFees } from "./extra-fees";
import { asianAllOthersCountriesOption1 } from "./regions/asian_all_others_contries/option1";
import { asianAllOthersCountriesOption2 } from "./regions/asian_all_others_contries/option2";
import { asianAllOthersCountriesOption3 } from "./regions/asian_all_others_contries/option3";
import { asianAllOthersCountriesDiscounts } from "./regions/asian_all_others_contries/discounts";
import { generateTotalPayments } from "./total";
import { openVetDiscounts } from "./regions/open_vet/discounts";

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
  
  // Discounts by regions
  if(data?.region?.code === "asian_all_other_countries") {
    asianAllOthersCountriesDiscounts(data, paymentType, courses, specialCases);
  } else if(data?.region?.code === "latin_america_europe") {
    // Latin discount
  } else if(data?.region?.code === "open_vet") {
    openVetDiscounts(data, paymentType, courses, specialCases);
  } else {
    // Lanzar error region no existe
  }
  
  // Generate Extra Fees
  let result = [
    ...generateExtraFees(data, courses, specialCases)
  ];

  // Options by region
  if(["asian_all_other_countries", "open_vet"].includes(data?.region?.code)) {
    if (paymentType === "option_1") {
      result = [
        ...result,
        ...asianAllOthersCountriesOption1(data, courses)
      ];
    } else if (paymentType === "option_2") {
      result = [
        ...result,
        ...asianAllOthersCountriesOption2(data, courses)
      ];
    } else if (paymentType === "option_3") {
      result = [
        ...result,
        ...asianAllOthersCountriesOption3(data, courses)
      ];
    }
  } else if(data?.region?.code === "latin_america_europe") {
    if (paymentType === "option_1") {
      result = [
        ...result,
        ...asianAllOthersCountriesOption1(data, courses)
      ];
    }
  } else {
    // Lanza error region no existe
  }

  result = [
    ...result,
    ...generateTotalPayments(result, courses, paymentType)
  ];

  return addIdToArray(result);
}
