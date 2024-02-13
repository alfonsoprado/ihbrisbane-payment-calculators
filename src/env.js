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
const asian_all_other_countries = ENV === "production" ? productionPaymentCalculators['asian_all_other_countries'] : developPaymentCalculators['asian_all_other_countries'];
const latin_america_europe = ENV === "production" ? productionPaymentCalculators['latin_america_europe'] : developPaymentCalculators['latin_america_europe'];
const open_vet = ENV === "production" ? productionPaymentCalculators['open_vet'] : developPaymentCalculators['open_vet'];

export const payments_calculators = {
  // Internal
  // Asian/All other countries
  internal_asian: `${asian_all_other_countries}?internal=${internal}`,
  // Latin America/Europe
  internal_latin: `${latin_america_europe}?internal=${internal}`,
  // Open VET
  internal_open_vet: `${open_vet}?internal=${internal}`,
  // External
  // Asian all other countries
  external_asian: asian_all_other_countries,
  // Latin America/Europe
  external_latin: latin_america_europe,
  // Open Vet
  external_open_vet: open_vet,
};

export const hero_banner = {
  asian_all_other_countries: `${MAIN_URL}/images/payment_calculator/in-person_vet_courses.png`,
  latin_america_europe: `${MAIN_URL}/images/payment_calculator/in-person_vet_courses.png`,
  open_vet: `${MAIN_URL}/images/payment_calculator/online_vet_courses.png`
};

export const ALS_STUDENT_HANDBOOK_URL = "http://ihbrisbane.synology.me:81/?resource=doc&doc_no=52400150";
export const REFUND_ENROLMENT_POLICY_URL = "https://www.ihbrisbane.com.au/admission/refund-and-enrolment-policy/";
export const VOCATIONAL_ENTRY_TEST_URL = "https://alscertificates.com/vocational-entry-test/";