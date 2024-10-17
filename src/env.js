import { developPaymentCalculators } from "./env.develop";
import { productionPaymentCalculators } from "./env.production";

export const ENV = process.env.NODE_ENV;

export const PAYMENT_CALCULATOR = process.env.REACT_APP_PC;

export const MAIN_URL =
  ENV === "production"
    ? productionPaymentCalculators["main_url"]
    : developPaymentCalculators["main_url"];
export const API_URL = `${MAIN_URL}/api`;
export const PAYMENT_CALCULATOR_API_URL = `${API_URL}/paymentcalculator`;
export const APPLICATION_FORM_PDF_API_URL = `${PAYMENT_CALCULATOR_API_URL}/pdf/application_form`;
export const PAYMENT_PLAN_PDF_API_URL = `${PAYMENT_CALCULATOR_API_URL}/pdf/payment_plan`;

const internal = developPaymentCalculators["internal"];

// Asian Market
const asia_others_vet =
  ENV === "production"
    ? productionPaymentCalculators["asia_others_vet"]
    : developPaymentCalculators["asia_others_vet"];
const asia_others_als_college =
  ENV === "production"
    ? productionPaymentCalculators["asia_others_als_college"]
    : developPaymentCalculators["asia_others_als_college"];
// LATAM/Europe Market
const latam_eu_vet =
  ENV === "production"
    ? productionPaymentCalculators["latam_eu_vet"]
    : developPaymentCalculators["latam_eu_vet"];
const latam_eu_elicos =
  ENV === "production"
    ? productionPaymentCalculators["latam_eu_elicos"]
    : developPaymentCalculators["latam_eu_elicos"];
const latam_eu_aged_care =
  ENV === "production"
    ? productionPaymentCalculators["latam_eu_aged_care"]
    : developPaymentCalculators["latam_eu_aged_care"];
const latam_eu_adccd =
  ENV === "production"
    ? productionPaymentCalculators["latam_eu_adccd"]
    : developPaymentCalculators["latam_eu_adccd"];

export const payments_calculators = {
  // Internal
  // Asian Market
  internal_asia_others_vet: `${asia_others_vet}?internal=${internal}`,
  internal_asia_others_als_college: `${asia_others_als_college}?internal=${internal}`,
  // LATAM/Europe Market
  internal_latam_eu_vet: `${latam_eu_vet}?internal=${internal}`,
  internal_latam_eu_elicos: `${latam_eu_elicos}?internal=${internal}`,
  internal_latam_eu_aged_care: `${latam_eu_aged_care}?internal=${internal}`,
  internal_latam_eu_adccd: `${latam_eu_adccd}?internal=${internal}`,

  // External
  // Asian Market
  external_asia_others_vet: asia_others_vet,
  external_asia_others_als_college: asia_others_als_college,
  // LATAM/Europe LATAM
  external_latam_eu_elicos: latam_eu_elicos,
  external_latam_eu_aged_care: latam_eu_aged_care,
  external_latam_eu_vet: latam_eu_vet,
  external_latam_eu_adccd: latam_eu_adccd,
};

export const hero_banner = {
  // Asian Market
  vet_asian_others_2025: `./business_retail_courses.jpg`,
  als_college_asian_2025: `./als_college_courses.jpg`,
  // LATAM/Europe
  vet_latam_europe_2025: `./banner_latin_europe_vet.jpg`,
  aged_care_latam_europe_2025: `./aged-care_courses.jpg`,
  elicos_latam_europe_2025: `./banner_latin_europe_elicos.jpg`,
  civil_construction_design_latam_europe_2025: `./banner_latin_europe_vet.jpg`,
};

export const ALS_STUDENT_HANDBOOK_URL =
  "http://ihbrisbane.synology.me:81/?resource=doc&doc_no=52400150";
export const REFUND_ENROLMENT_POLICY_URL =
  "https://www.ihbrisbane.com.au/admission/refund-and-enrolment-policy/";
export const VOCATIONAL_ENTRY_TEST_URL =
  "https://alscertificates.com/vocational-entry-test/";
