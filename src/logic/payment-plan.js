import { generateTotalPayments } from "./total";
import { minimumInstallmentThreshold } from "./minimum-installment-threshold";

import { generateExtraFeesVET } from "./vet/extra-fees";
import { asianAllOthersCountriesOption1VET } from "./vet/asian_all_others_countries/option1";
import { asianAllOthersCountriesOption2VET } from "./vet/asian_all_others_countries/option2";
import { asianAllOthersCountriesOption3VET } from "./vet/asian_all_others_countries/option3";
import { asianAllOthersCountriesDiscountsVET } from "./vet/asian_all_others_countries/discounts";
import { openVetDiscountsVET } from "./vet/open_vet/discounts";

import { latinAmericaEuropeDiscountsVET } from "./vet/latin_europe/discounts";
import { latinAmericaEuropeOption1VET } from "./vet/latin_europe/option1";


import { generateExtraFeesLatinAmericaEuropeElicos } from "./elicos/latin_europe/extra-fees";
import { latinAmericaEuropeOption1Elicos } from "./elicos/latin_europe/option1";
import { latinAmericaEuropeDiscountsElicos } from "./elicos/latin_europe/discounts";

import { asianAllOthersCountriesDiscountsAgedCare } from "./als_college/asian_all_others_countries/aged_care/discounts";
import { asianAllOthersCountriesGenerateExtraFeesAgedCare } from "./als_college/asian_all_others_countries/aged_care/extra-fees";
import { asianAllOthersCountriesOption1AgedCare } from "./als_college/asian_all_others_countries/aged_care/option1";

import { latinAmericaEuropeDiscountsAgedCare } from "./aged_care/latin_europe/discounts";
import { latinAmericaEuropeOption1AgedCare } from "./aged_care/latin_europe/option1";
import { asianAllOthersCountriesGenerateExtraFeesALSCollege } from "./als_college/asian_all_others_countries/civil/extra-fees";
import { asianAllOthersCountriesStandardPaymentPlanCivil } from "./als_college/asian_all_others_countries/civil/standard-payment-plan";
import { asianAllOthersCountriesOption1Civil } from "./als_college/asian_all_others_countries/civil/option1";
import { asianAllOthersCountriesDiscountsALSCollege } from "./als_college/asian_all_others_countries/civil/discounts";

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

  // Total Tuition = Tuition Fee per week x weeks
  for (const course of courses) {
    if (course?.coursePricing?.weekly_tuition_fee) {
      course.tuition = course?.coursePricing?.weekly_tuition_fee * parseInt(course?.duration);
    } else {
      course.tuition = course?.coursePricing?.tuition_fee;
    }
  }

  let result = [];

  /**
   * VET PAYMENT CALCULATOR
   */
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
      ...result,
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

  /**
  * ALS COLLEGE PAYMENT CALCULATOR
  */
  } else if (data?.payment_calculator?.type === 'als_college') {
    // Discounts by regions
    if (data?.region?.code === "asian_all_other_countries") {
      //course
      if(["option_1-horticulture", "option_2-horticulture", "option_3-horticulture"].includes(paymentType)) {
        asianAllOthersCountriesDiscountsVET(data, paymentType, courses, specialCases);
      } else if(paymentType === "option_1-aged_care") {
        asianAllOthersCountriesDiscountsAgedCare(data, paymentType, courses, specialCases);
      } else if(["standard_payment_plan-civil", "option_1-civil", "pay_upfront"].includes(paymentType)) {
        asianAllOthersCountriesDiscountsALSCollege(data, paymentType, courses, specialCases);
      }
    } else {
      console.error("Region doesn't exists.");
      return [];
    }

    // Generate Extra Fees
  
    if(["option_1-horticulture", "option_2-horticulture", "option_3-horticulture"].includes(paymentType)) {
      result = [
        ...result,
        ...generateExtraFeesVET(data, paymentType, courses, specialCases)
      ];
    } else if (paymentType === "option_1-aged_care") {
      result = [
        ...result,
        ...asianAllOthersCountriesGenerateExtraFeesAgedCare(data, paymentType, courses, specialCases)
      ];
    } else if(["standard_payment_plan-civil", "option_1-civil", "pay_upfront"].includes(paymentType)) {
      result = [
        ...result,
        ...asianAllOthersCountriesGenerateExtraFeesALSCollege(data, paymentType, courses, specialCases)
      ];
    }

    // Making plan
    if(data?.region?.code === "asian_all_other_countries") {
      if(paymentType === "option_1-horticulture") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption1VET(data, courses, paymentType)
        ];
      } else if(paymentType === "option_2-horticulture") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption2VET(data, courses, paymentType)
        ];
      } else if(paymentType === "option_3-horticulture") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption3VET(data, courses, paymentType)
        ];
      } else if(paymentType === "option_1-aged_care") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption1AgedCare(data, courses)
        ];
      } else if(paymentType === "standard_payment_plan-civil") {
        result = [
          ...result,
          ...asianAllOthersCountriesStandardPaymentPlanCivil(data, courses, paymentType)
        ];
      } else if(paymentType === "option_1-civil") {
        result = [
          ...result,
          ...asianAllOthersCountriesOption1Civil(data, courses, paymentType)
        ];
      }
    } else {
      console.error("Region doesn't exists.");
      return []
    }
  
  /**
   * ELICOS PAYMENT CALCULATOR
   */
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
      ...result,
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
   
  /**
   * AGED CARE PAYMENT CALCULATOR
   */
  } else if (data?.payment_calculator?.type === 'aged_care') {
    // Discounts by regions
    // if (data?.region?.code === "asian_all_other_countries") {
    //   asianAllOthersCountriesAgedCare(data, paymentType, courses, specialCases);
    // } else 
    if(data?.region?.code === "latin_america_europe") {
      latinAmericaEuropeDiscountsAgedCare(data, paymentType, courses, specialCases);
    } else {
      console.error("Region doesn't exists.");
      return [];
    }

    // Generate Extra Fees
    // if (data?.region?.code === "asian_all_other_countries") {
    //   result = [
    //     ...result,
    //     ...asianAllOthersCountriesGenerateExtraFeesAgedCare(data, paymentType, courses, specialCases)
    //   ];
    // } else 
    if(data?.region?.code === "latin_america_europe") {
      result = [
        ...result,
        // Include on age_care/latin_europe/option1.js
      ];
    } else {
      console.error("Region doesn't exists.");
      return [];
    }

    //if (data?.region?.code === "asian_all_other_countries") {
    //   if (paymentType === "option_1") {
    //     result = [
    //       ...result,
    //       ...asianAllOthersCountriesOption1AgedCare(data, courses)
    //     ];
    //   }
    // } else 
    if(data?.region?.code === "latin_america_europe") {
      if (paymentType === "option_1") {
        result = [
          ...result,
          ...latinAmericaEuropeOption1AgedCare(data, paymentType, courses, specialCases)
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

  return addIdToArray(result);
}
