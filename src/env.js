import { developPaymentCalculators } from "./env.develop";
import { productionPaymentCalculators } from "./env.production";

export const ENV = process.env.NODE_ENV;

export const PAYMENT_CALCULATOR = process.env.REACT_APP_PC;

export const MAIN_URL = ENV === "production" ? productionPaymentCalculators['main_url'] : developPaymentCalculators['main_url'];
export const API_URL = `${MAIN_URL}/api`;
export const PAYMENT_CALCULATOR_API_URL = `${API_URL}/paymentcalculator`;
export const APPLICATION_FORM_PDF_API_URL = `${PAYMENT_CALCULATOR_API_URL}/pdf/application_form`;
export const PAYMENT_PLAN_PDF_API_URL = `${PAYMENT_CALCULATOR_API_URL}/pdf/payment_plan`;

const internal = ENV === "production" ? productionPaymentCalculators['internal'] : developPaymentCalculators['internal'];
const asian_all_other_countries_vet = ENV === "production" ? productionPaymentCalculators['asian_all_other_countries_vet'] : developPaymentCalculators['asian_all_other_countries_vet'];
const latin_america_europe_vet = ENV === "production" ? productionPaymentCalculators['latin_america_europe_vet'] : developPaymentCalculators['latin_america_europe_vet'];
const online_vet = ENV === "production" ? productionPaymentCalculators['online_vet'] : developPaymentCalculators['online_vet'];
const latin_america_europe_elicos = ENV === "production" ? productionPaymentCalculators['latin_america_europe_elicos'] : developPaymentCalculators['latin_america_europe_elicos'];
const asian_all_other_countries_aged_care = ENV === "production" ? productionPaymentCalculators['asian_all_other_countries_aged_care'] : developPaymentCalculators['asian_all_other_countries_aged_care'];
const latin_america_europe_aged_care = ENV === "production" ? productionPaymentCalculators['latin_america_europe_aged_care'] : developPaymentCalculators['latin_america_europe_aged_care'];

export const payments_calculators = {
  // Internal
  // Asian/All other countries
  internal_asian_vet: `${asian_all_other_countries_vet}?internal=${internal}`,
  // Latin America/Europe
  internal_latin_america_europe_vet: `${latin_america_europe_vet}?internal=${internal}`,
  // Open VET
  internal_online_vet: `${online_vet}?internal=${internal}`,
  // Latin America/Europe Elicos
  internal_latin_america_europe_elicos: `${latin_america_europe_elicos}?internal=${internal}`,
  // Asian/All other countries
  internal_asian_aged_care: `${asian_all_other_countries_aged_care}?internal=${internal}`,
  // Latin America/Europe
  internal_latin_america_europe_aged_care: `${latin_america_europe_aged_care}?internal=${internal}`,
  // External
  // Asian all other countries
  external_asian_vet: asian_all_other_countries_vet,
  // Latin America/Europe
  external_latin_america_europe_vet: latin_america_europe_vet,
  // Open Vet
  external_online_vet: online_vet,
  // Latin America/Europe Elicos
  external_latin_america_europe_elicos: latin_america_europe_elicos,
  // Asian all other countries
  external_asian_aged_care: asian_all_other_countries_aged_care,
  // Latin America/Europe
  external_latin_america_europe_aged_care: latin_america_europe_aged_care,
};

export const hero_banner = {
  asian_all_other_countries_vet: `./in-person_vet_courses.png`,
  latin_america_europe_vet: `./banner_latin_europe_vet.jpg`,
  asian_all_other_countries_aged_care: `./aged-care_courses.jpg`,
  latin_america_europe_aged_care: `./aged-care_courses.jpg`,
  online_vet: `./online_vet_courses.png`,
  latin_america_europe_elicos: `./banner_latin_europe_elicos.jpg`,
};

export const ALS_STUDENT_HANDBOOK_URL = "http://ihbrisbane.synology.me:81/?resource=doc&doc_no=52400150";
export const REFUND_ENROLMENT_POLICY_URL = "https://www.ihbrisbane.com.au/admission/refund-and-enrolment-policy/";
export const VOCATIONAL_ENTRY_TEST_URL = "https://alscertificates.com/vocational-entry-test/";