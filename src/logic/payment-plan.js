import { generateExtraFeesVET } from "./vet/extra-fees";
import { asianAllOthersCountriesOption1VET } from "./vet/asian_all_others_countries/option1";
import { asianAllOthersCountriesOption2VET } from "./vet/asian_all_others_countries/option2";
import { asianAllOthersCountriesOption3VET } from "./vet/asian_all_others_countries/option3";
import { asianAllOthersCountriesDiscountsVET } from "./vet/asian_all_others_countries/discounts";
import { generateTotalPayments } from "./total";
import { openVetDiscountsVET } from "./vet/open_vet/discounts";
import { latinAmericaEuropeDiscountsVET } from "./vet/latin_europe/discounts";
import { latinAmericaEuropeOption1VET } from "./vet/latin_europe/option1";
import { minimumInstallmentThreshold } from "./minimum-installment-threshold";
import { generateExtraFeesLatinAmericaEuropeElicos } from "./elicos/latin_europe/extra-fees";
import { latinAmericaEuropeOption1Elicos } from "./elicos/latin_europe/option1";
import { latinAmericaEuropeDiscountsElicos } from "./elicos/latin_europe/discounts";

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

  let result = [];

  if (data?.payment_calculator?.type === 'vet') {
    // Discounts by regions
    if (data?.region?.code === "asian_all_other_countries") {
      asianAllOthersCountriesDiscountsVET(data, paymentType, courses, specialCases);
    } else if (data?.region?.code === "latin_america_europe") {
      latinAmericaEuropeDiscountsVET(data, paymentType, courses, specialCases);
    } else if (data?.region?.code === "online") {
      openVetDiscountsVET(data, paymentType, courses, specialCases);
    } else {
      console.error("Region doesn't exists.");
      return [];
    }

    // Generate Extra Fees
    result = [
      ...generateExtraFeesVET(data, paymentType, courses, specialCases)
    ];

    // Making plan
    if (["asian_all_other_countries", "online"].includes(data?.region?.code)) {
      if (paymentType === "option_1") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption1VET(data, courses)
        ];
      } else if (paymentType === "option_2") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption2VET(data, courses)
        ];
      } else if (paymentType === "option_3") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption3VET(data, courses)
        ];
      }
    } else if (data?.region?.code === "latin_america_europe") {
      if (paymentType === "option_1") {
        result = [
          ...result,
          ...latinAmericaEuropeOption1VET(data, courses)
        ];
      }
    } else {
      console.error("Region doesn't exists.");
      return []
    }
  } else if (data?.payment_calculator?.type === 'elicos') {
    // Discounts by regions
    if (data?.region?.code === "latin_america_europe") {
      latinAmericaEuropeDiscountsElicos(data, paymentType, courses, specialCases);
    } else {
      console.error("Region doesn't exists.");
      return [];
    }

     // Generate Extra Fees
     result = [
      ...generateExtraFeesLatinAmericaEuropeElicos(data, paymentType, courses, specialCases)
    ];

    if (data?.region?.code === "latin_america_europe") {
      if (paymentType === "option_1") {
        result = [
          ...result,
          ...latinAmericaEuropeOption1Elicos(data, courses)
        ];
      }
    } else {
      console.error("Region doesn't exists.");
      return []
    }
  }

  // Minimum installment threshold $100
  result = minimumInstallmentThreshold(data, result);

  // Total Payments
  result = [
    ...result,
    ...generateTotalPayments(data, result, courses, paymentType)
  ];

  console.debug(result);

  return addIdToArray(result);
}
