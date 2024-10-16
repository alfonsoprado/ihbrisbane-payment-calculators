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

const internal =
  ENV === "production"
    ? productionPaymentCalculators["internal"]
    : developPaymentCalculators["internal"];

// Asian Market
const asian_all_other_countries_vet =
  ENV === "production"
    ? productionPaymentCalculators["asian_all_other_countries_vet"]
    : developPaymentCalculators["asian_all_other_countries_vet"];
const asian_all_other_countries_als_college =
  ENV === "production"
    ? productionPaymentCalculators["asian_all_other_countries_als_college"]
    : developPaymentCalculators["asian_all_other_countries_als_college"];
// LATAM/Europe Market
const latin_america_europe_vet =
  ENV === "production"
    ? productionPaymentCalculators["latin_america_europe_vet"]
    : developPaymentCalculators["latin_america_europe_vet"];
const latin_america_europe_elicos =
  ENV === "production"
    ? productionPaymentCalculators["latin_america_europe_elicos"]
    : developPaymentCalculators["latin_america_europe_elicos"];
const latin_america_europe_aged_care =
  ENV === "production"
    ? productionPaymentCalculators["latin_america_europe_aged_care"]
    : developPaymentCalculators["latin_america_europe_aged_care"];
const latin_america_europe_adccd =
  ENV === "production"
    ? productionPaymentCalculators["latin_america_europe_adccd"]
    : developPaymentCalculators["latin_america_europe_adccd"];

export const payments_calculators = {
  // Internal
  // Asian Market
  internal_asian_vet: `${asian_all_other_countries_vet}?internal=${internal}`,
  internal_asian_all_other_countries_als_college: `${asian_all_other_countries_als_college}?internal=${internal}`,
  // LATAM/Europe Market
  internal_latin_america_europe_vet: `${latin_america_europe_vet}?internal=${internal}`,
  internal_latin_america_europe_elicos: `${latin_america_europe_elicos}?internal=${internal}`,
  internal_latin_america_europe_aged_care: `${latin_america_europe_aged_care}?internal=${internal}`,
  internal_latin_america_europe_adccd: `${latin_america_europe_adccd}?internal=${internal}`,

  // External
  // Asian Market
  external_asian_vet: asian_all_other_countries_vet,
  external_asian_all_other_countries_als_college:
    asian_all_other_countries_als_college,
  // LATAM/Europe LATAM
  external_latin_america_europe_elicos: latin_america_europe_elicos,
  external_latin_america_europe_aged_care: latin_america_europe_aged_care,
  external_latin_america_europe_vet: latin_america_europe_vet,
  external_latin_america_europe_adccd: latin_america_europe_adccd,
};

export const hero_banner = {
  // Asian Market
  asian_all_other_countries_vet: `./business_retail_courses.jpg`,
  asian_all_other_countries_als_college: `./als_college_courses.jpg`,
  // LATAM/Europe
  latin_america_europe_vet: `./banner_latin_europe_vet.jpg`,
  latin_america_europe_aged_care: `./aged-care_courses.jpg`,
  latin_america_europe_elicos: `./banner_latin_europe_elicos.jpg`,
  latin_america_europe_adccd: `./banner_latin_europe_vet.jpg`,
};

export const ALS_STUDENT_HANDBOOK_URL =
  "http://ihbrisbane.synology.me:81/?resource=doc&doc_no=52400150";
export const REFUND_ENROLMENT_POLICY_URL =
  "https://www.ihbrisbane.com.au/admission/refund-and-enrolment-policy/";
export const VOCATIONAL_ENTRY_TEST_URL =
  "https://alscertificates.com/vocational-entry-test/";
