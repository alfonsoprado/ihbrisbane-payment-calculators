export const MAIN_URL = "http://localhost/apps/public";
export const API_URL = `${MAIN_URL}/api`;
export const PAYMENT_CALCULATOR_API_URL = `${API_URL}/paymentcalculator`;
export const APPLICATION_FORM_PDF_API_URL = `${PAYMENT_CALCULATOR_API_URL}/pdf/application_form`;
export const PAYMENT_PLAN_PDF_API_URL = `${PAYMENT_CALCULATOR_API_URL}/pdf/payment_plan`;

const internal = 'd1efad72dc5b17dc66a46767c32fff40';
const asian_all_other_countries = '9b4fbab0-3eb5-487d-bffe-463f6ff58f81';
const latin_america_europe = "9b4fbab0-9045-441a-8e24-149ea4742e38";
const open_vet = "9b4fbab0-9152-45b5-acc8-448c5392c856";

export const payments_calculators = {
  // Internal
  // Asian/All other countries
  internal_asian_all_other_countries: `${asian_all_other_countries}?internal=${internal}`,
  // Latin America/Europe
  internal_latin_america_europe: `${latin_america_europe}?internal=${internal}`,
  // Open VET
  internal_open_vet: `${open_vet}?${open_vet}internal=${internal}`,
  // External
  // Asian all other countries
  external_asian_all_other_countries: asian_all_other_countries,
  // Latin America/Europe
  external_latin_america_europe: latin_america_europe,
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