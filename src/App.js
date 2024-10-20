import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";
import Menu from "./Components/Menu/Menu";
import Courses from "./Components/Courses";
import PaymentPlan from "./Components/PaymentPlan";
import { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { generatePaymentPlan } from "./logic/payment-plan";
import useSWR from "swr";
import {
  checkForOverlaps,
  findFinishDateCourse,
  formatDate,
} from "./helpers/dates";
import ApplicationForm from "./Components/ApplicationForm";
import { getPaymentCalculatorParameters, scrollTo } from "./helpers/tools";
import {
  PAYMENT_CALCULATOR,
  PAYMENT_CALCULATOR_API_URL,
  hero_banner,
  payments_calculators,
} from "./env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import util from "lodash";
import SuccessAlert from "./SuccessAlert";
import { formatCourse } from "./helpers/ihbrisbane";

const fetcher = (url) => fetch(url).then((res) => res.json());

const defaultValuesApplication = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "Not Given",
  USI: "",
  email: "",
  phone: "",
  nationality: "",
  passportNumber: "",
  currentAddress: "",
  agencyName: "",
  counselorName: "",
  counselorEmail: "",
  englishLevel: "Not Given",
  disabilitiesChronicConditions: "Not Given",
  visa: "Student",
  studentCurrentLocation: "Onshore",
  DHAOffice: "Onshore",
  enrolledAnotherInstitutionAustralia: "No",
  additionalStudy: "No",
  OSHC: "No required",
  havePrevioulsyHeldVisaAustralia: "No",
  previousVisaAustraliaDetails: "",
  haveYouBeenRefusedOrCancelledVisa: "No",
  haveYouBeenRefusedOrCancelledVisaDetails: "",
};

const middleCenterStyle = {
  position: "absolute",
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function App({ paymentCalculator }) {
  const [counterCoursesAdded, setCounterCoursesAdded] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [specialCases, setSpecialCases] = useState([]);

  const [paymentPlan, setPaymentPlan] = useState([]);
  const [paymentPlanTableEnabled, setPaymentTableEnabled] = useState(false);

  const [application, setApplication] = useState(defaultValuesApplication);
  const [applicationEnabled, setApplicationEnabled] = useState(false);
  const [available, setAvailable] = useState(false);

  const { data, error, isLoading } = useSWR(
    `${PAYMENT_CALCULATOR_API_URL}/${
      payments_calculators[
        paymentCalculator ? paymentCalculator : PAYMENT_CALCULATOR
      ]
    }`,
    fetcher
  );

  useEffect(() => {
    // Errors
    let errors = [];

    // General Errors
    let notEmpty = true;
    let courseWithoutDuration = false;
    let hasCourseCurrentYear = false;

    for (const course of courses) {
      if (!notEmpty) {
        notEmpty = Object.entries(course).every((field) => field[1]);
      }

      if (!course?.duration || course?.duration === "0") {
        courseWithoutDuration = true;
      }

      const courseStartDate = new Date(course?.startDate);
      if (courseStartDate.getFullYear() === parseInt(data?.year)) {
        hasCourseCurrentYear = true;
      }
    }

    if (!hasCourseCurrentYear && courses?.length > 0) {
      errors.push({
        message: `There must be at least one course that belongs to the year ${data?.year}.`,
        type: "input_error",
      });
    }

    if (courseWithoutDuration) {
      errors.push({
        message: "There is at least one course whose doesn't have duration.",
        type: "input_error",
      });
    }

    if (!notEmpty) {
      errors.push({
        message: "The fields of the courses cannot be empty.",
        type: "input_error",
      });
    }

    if (checkForOverlaps(courses)) {
      errors.push({
        message:
          "There is at least one course whose date range overlaps with another course.",
        type: "input_error",
      });
    }

    // VET Errors
    if (
      data?.payment_calculator?.type === "vet" &&
      data?.region?.code === "online"
    ) {
      let intensiveCourse = 0;
      let standardCourse = 0;

      for (const course of courses) {
        if (!notEmpty) {
          notEmpty = Object.entries(course).every((field) => field[1]);
        }

        if (!course?.duration || course?.duration === "0") {
          courseWithoutDuration = true;
        }

        if (course?.coursePricing?.course?.type === "intensive")
          intensiveCourse += 1;
        if (course?.coursePricing?.course?.type === "standard")
          standardCourse += 1;
      }

      if (intensiveCourse === 1 && standardCourse === 0) {
        errors.push({
          message: "We don't accept standalone INTENSIVE course.",
          type: "input_error",
        });
      }
    }

    // Elicos Errors
    if (data?.payment_calculator?.type === "elicos") {
      let duration_weeks_day_courses_elicos = 0;
      let has_elicos_course = false;

      const { minimum_weeks } =
        getPaymentCalculatorParameters(data)?.restrictions;

      for (const course of courses) {
        if (
          data?.payment_calculator?.type === "elicos" &&
          minimum_weeks?.courses?.includes(
            course?.coursePricing?.course?.cricos_code
          )
        ) {
          has_elicos_course = true;
          duration_weeks_day_courses_elicos += parseInt(course?.duration);
        }
      }

      if (
        has_elicos_course &&
        duration_weeks_day_courses_elicos < minimum_weeks?.quantiy_weeks
      ) {
        errors.push({
          message: `The total duration of each course must be greater than ${minimum_weeks?.quantiy_weeks} weeks to be eligible for a payment plan (unless combined with other courses).`,
          type: "input_error",
        });
      }
    }

    // Aged Care
    if (data?.payment_calculator?.type === "aged_care") {
      const paymentCalculatorParameters = JSON.parse(
        data?.payment_calculator?.parameters
      );
      const firstCourseCodesList =
        paymentCalculatorParameters?.course_order_selection_list;
      const firstCourseNameList = firstCourseCodesList.map((courseCode) => {
        const course = data?.course_pricings?.find(
          (coursePricing) => courseCode === coursePricing?.course?.course_code
        )?.course;
        return formatCourse(course);
      });

      const courseCodes = courses.map(
        (course) => course?.coursePricing?.course?.course_code
      );

      if (
        courseCodes?.length > 0 &&
        courseCodes?.every(
          (courseCode) => !firstCourseCodesList.includes(courseCode)
        )
      ) {
        errors.push({
          message: `The first course have to be one of the following courses: "${firstCourseNameList.join(
            ", "
          )}".`,
          type: "input_error",
        });
      }

      // Aged Care
      if (
        courseCodes.includes("CHC33021") &&
        courseCodes.includes("CHC43015") &&
        !("CHC33021" === courseCodes[0] && "CHC43015" === courseCodes[1])
      ) {
        errors.push({
          message: `The order of the first and second course have to be "Certificate III in Individual Support" and "Certificate IV in Ageing Support" respectively.`,
          type: "input_error",
        });
      } else if (
        (courseCodes.includes("CHC33021") ||
          courseCodes.includes("CHC43015")) &&
        !["CHC33021", "CHC43015"].includes(courseCodes[0])
      ) {
        let firstCourseName = "Certificate III in Individual Support";
        if (courseCodes.includes("CHC43015")) {
          firstCourseName = "Certificate IV in Ageing Support";
        }
        errors.push({
          message: `The first course has to be "${firstCourseName}".`,
          type: "input_error",
        });
      }
    }

    if (errors?.length > 0) {
      setApplicationEnabled(false);
    }

    const quotaEnabled = data?.quota_enabled;

    setSuccessMessage("");
    setErrorMessages(errors);
    setAvailable(!quotaEnabled);
  }, [data, courses]);

  // Only develop: it is only happens when the payment calculator is changed
  useEffect(() => {
    setCourses([]);
    setPaymentPlan([]);
    setPaymentType("");
    setSpecialCases([]);

    setPaymentTableEnabled(false);
    setApplication(defaultValuesApplication);
    setApplicationEnabled(false);
  }, [paymentCalculator]);

  useEffect(() => {
    if (courses.length === 0) {
      setPaymentType("");
    }
  }, [courses]);

  const cleanPaymentPlan = () => {
    setPaymentPlan([]);
    setPaymentTableEnabled(false);
  };

  const createCourse = (course) => {
    let id = `${course?.coursePricing?.course?.id}-${counterCoursesAdded}`;
    setCounterCoursesAdded(counterCoursesAdded + 1);
    setCourses(
      [...courses, { ...course, id }].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      )
    );
    cleanPaymentPlan();
  };

  const updateCourse = (id, propName, newValue) => {
    const updatedItems = courses
      .map((item) => {
        if (item.id === id) {
          if (propName === "startDate") {
            return {
              ...item,
              startDate: newValue,
              finishDate: formatDate(
                findFinishDateCourse(newValue, item?.duration),
                "yyyy-MM-dd"
              ),
            };
          } else if (propName === "duration") {
            return {
              ...item,
              duration: newValue,
              finishDate: formatDate(
                findFinishDateCourse(item?.startDate, newValue),
                "yyyy-MM-dd"
              ),
            };
          }
          return { ...item, [propName]: newValue };
        }
        return item;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setCourses(updatedItems);
    cleanPaymentPlan();
    setApplicationEnabled(false);
  };

  const updateApplication = (propName, newValue) => {
    const updatedApplication = {
      ...application,
      [propName]: newValue,
    };
    setApplication(updatedApplication);
  };

  const removeCourse = (id) => {
    setCourses(
      courses
        .filter((course) => course.id !== id)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    );
    cleanPaymentPlan();
    setApplicationEnabled(false);
  };

  const removeAllCourses = () => {
    setCourses([]);
    cleanPaymentPlan();
    setApplicationEnabled(false);
  };

  const resetApplication = () => {
    setApplication(defaultValuesApplication);
    setApplicationEnabled(false);
  };

  const resetAll = () => {
    removeAllCourses();
    resetApplication();
  };

  const checkAvailability = () => {
    // Quotas
    const fetchQuotaData = async () => {
      try {
        const response = await axios.get(
          `${PAYMENT_CALCULATOR_API_URL}/quotas`
        );

        const startDateCourse = new Date(courses[0]?.startDate);
        const coursesIds = courses?.map(
          (course) => course?.coursePricing?.course?.id
        );

        const quotas = response?.data;

        const quotaAvailable = quotas
          .filter((quota) => quota?.quota_dates?.length > 0)
          .filter((quota) => quota?.quota_conditions?.length > 0)
          .some((quota) => {
            if (!quota.enabled) {
              return false;
            }

            const quotaInDateRange = quota?.quota_dates?.some((qd) => {
              return (
                startDateCourse >= new Date(qd.start_date) &&
                startDateCourse <= new Date(qd.end_date) &&
                qd.quota_available &&
                qd.quota_amount_used < qd.quota_amount
              );
            });

            if (!quotaInDateRange) {
              return false;
            }

            const quotaConditionMet = quota?.quota_conditions?.every((qc) => {
              const isCourses = qc.courses.length > 0;
              const isCategories = qc.categories.length > 0;

              let totalWeeksCourses, totalCourses;
              if (!isCourses && !isCategories) {
                totalWeeksCourses = courses.reduce(
                  (totalWeeks, course) => totalWeeks + course?.duration,
                  0
                );
                totalCourses = courses.length;
              } else if (isCourses && !isCategories) {
                const quotaCoursesId = qc?.courses?.map(
                  (qcCourse) => qcCourse?.course?.id
                );
                const coursesInQuotasCourses = util.intersection(
                  coursesIds,
                  quotaCoursesId
                );
                totalCourses = coursesInQuotasCourses.length;
                totalWeeksCourses = coursesInQuotasCourses.reduce(
                  (totalWeeks, courseId) => {
                    return (
                      totalWeeks +
                      courses
                        ?.map((course) => course?.coursePricing?.course)
                        .find((course) => course?.id === courseId)
                        ?.duration_weeks
                    );
                  },
                  0
                );
              } else if (!isCourses && isCategories) {
                const quotaCoursesId = [];
                for (const item of qc?.categories) {
                  const quotaCourses = item?.category?.courses ?? [];
                  for (const quotaCourse of quotaCourses) {
                    if (!quotaCoursesId.includes(quotaCourse)) {
                      quotaCoursesId.push(quotaCourse?.id);
                    }
                  }
                }
                const coursesInQuotasCourses = util.intersection(
                  coursesIds,
                  quotaCoursesId
                );
                totalCourses = coursesInQuotasCourses.length;
                totalWeeksCourses = coursesInQuotasCourses.reduce(
                  (totalWeeks, courseId) => {
                    return (
                      totalWeeks +
                      courses
                        ?.map((course) => course?.coursePricing?.course)
                        .find((course) => course?.id === courseId)
                        ?.duration_weeks
                    );
                  },
                  0
                );
              } else {
                throw new Error(
                  "QuotaError: There can not be courses and categories at the same time."
                );
              }

              return (
                totalCourses >= qc?.min_courses &&
                totalWeeksCourses >= qc?.min_weeks
              );
            });

            return quotaInDateRange && quotaConditionMet;
          });

        if (!quotaAvailable) {
          setErrorMessages([
            {
              message:
                "Sorry, but we are not currently accepting applications for this combination of courses for these dates. Please reach out to our marketing team for help with what is available.",
              type: "quota_error",
            },
          ]);
        } else {
          setSuccessMessage(
            "Thank you - we are accepting this combination; please continue with your application."
          );
          setAvailable(true);
        }
      } catch (err) {
        setErrorMessages([
          {
            message:
              "Server error, could not validate available quotas, please contact the administrator.",
            type: "server_error",
          },
        ]);
      }
    };
    fetchQuotaData();
  };

  const createPaymentPlan = () => {
    const paymentPlan = generatePaymentPlan(
      data,
      courses,
      paymentType,
      specialCases
    );
    setPaymentPlan(paymentPlan);

    return paymentPlan;
  };

  const showPaymentPlanTable = () => {
    setPaymentTableEnabled(true);
    setApplicationEnabled(false);
    createPaymentPlan();
    scrollTo("payment_plan");
  };

  const showApplicationForm = () => {
    setPaymentTableEnabled(false);
    setApplicationEnabled(true);
    scrollTo("application");
  };

  if (error)
    return (
      <div style={middleCenterStyle}>
        <div>
          Failed to load <FontAwesomeIcon icon={faBug} />
        </div>
      </div>
    );
  if (isLoading)
    return (
      <div style={middleCenterStyle}>
        <div>
          <Spinner className="ms-3" animation="border" variant="dark" />
          <p>Loading...</p>
        </div>
      </div>
    );

  return (
    <Container>
      <Row className="mt-2">
        {data?.payment_calculator?.allow === "external" && (
          <Col sm={12}>
            <Image
              src={
                hero_banner[
                  `${data?.region?.code}_${data?.payment_calculator?.type}`
                ]
              }
              fluid
            />
          </Col>
        )}
        <Col className="mt-2" sm={12}>
          <Card>
            {data?.payment_calculator?.allow === "internal" && (
              <Card.Header>
                <h4 className="my-1">
                  {data?.region?.name}: {data?.payment_calculator?.name}
                </h4>
              </Card.Header>
            )}
            {data?.payment_calculator?.allow === "external" && (
              <Card.Body className="text-center m-1">
                <div
                  dangerouslySetInnerHTML={{ __html: data?.external_message }}
                />
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={4}>
          <Menu
            data={data}
            createCourse={createCourse}
            errorMessages={errorMessages}
            cleanPaymentPlan={cleanPaymentPlan}
            createPaymentPlan={createPaymentPlan}
            showPaymentPlanTable={showPaymentPlanTable}
            showApplicationForm={showApplicationForm}
            paymentType={paymentType}
            updatePaymentType={setPaymentType}
            specialCases={specialCases}
            updateSpecialCases={setSpecialCases}
            courses={courses}
            available={available}
            checkAvailability={checkAvailability}
            resetAll={resetAll}
          />
        </Col>
        <Col sm={8}>
          <ErrorAlert errorMessages={errorMessages} />
          <SuccessAlert message={successMessage} />
          <Courses
            data={data}
            courses={courses}
            updateCourse={updateCourse}
            removeCourse={removeCourse}
            removeAllCourses={removeAllCourses}
            checkAvailability={checkAvailability}
            errorMessages={errorMessages}
            quotaEnabled={data?.quota_enabled}
          />
        </Col>
      </Row>
      {paymentPlanTableEnabled && (
        <Row id="payment_plan">
          <Col>
            <PaymentPlan data={data} paymentPlan={paymentPlan} />
          </Col>
        </Row>
      )}
      {applicationEnabled && (
        <Row id="application">
          <Col>
            <ApplicationForm
              data={data}
              courses={courses}
              paymentType={paymentType}
              specialCases={specialCases}
              application={application}
              updateApplication={updateApplication}
              resetApplication={resetApplication}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
