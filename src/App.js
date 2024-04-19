import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";
import Menu from "./Components/Menu/Menu";
import Courses from "./Components/Courses";
import PaymentPlan from "./Components/PaymentPlan";
import { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { generatePaymentPlan } from "./logic/payment-plan";
import useSWR from 'swr';
import { checkForOverlaps, findFinishDateCourse, formatDate } from "./helpers/dates";
import ApplicationForm from "./Components/ApplicationForm";
import { getPaymentCalculatorParameters, getPaymentOptions, scrollTo } from "./helpers/tools";
import { PAYMENT_CALCULATOR, PAYMENT_CALCULATOR_API_URL, hero_banner, payments_calculators } from "./env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

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
}

const middleCenterStyle = {
  position: 'absolute',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function App({ paymentCalculator }) {
  const [counterCoursesAdded, setCounterCoursesAdded] = useState(0);
  const [errorMessages, setErrorMessage] = useState([]);
  const [courses, setCourses] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [specialCases, setSpecialCases] = useState([]);

  const [paymentPlan, setPaymentPlan] = useState([]);
  const [paymentPlanTableEnabled, setPaymentTableEnabled] = useState(false);

  const [application, setApplication] = useState(defaultValuesApplication);
  const [applicationEnabled, setApplicationEnabled] = useState(false);

  const { data, error, isLoading } = useSWR(`${PAYMENT_CALCULATOR_API_URL}/${payments_calculators[paymentCalculator ? paymentCalculator : PAYMENT_CALCULATOR]}`, fetcher)

  useEffect(() => {
    // Errors
    let errors = [];

    // General Errors
    let notEmpty = true;
    let courseWithoutDuration = false;

    for (const course of courses) {
      if (!notEmpty) {
        notEmpty = Object.entries(course).every((field) => field[1]);
      }

      if (!course?.duration || course?.duration === "0") {
        courseWithoutDuration = true;
      }
    }

    if (courseWithoutDuration) {
      errors.push("There is at least one course whose doesn't have duration.");
    }

    if (!notEmpty) {
      errors.push("The fields of the courses cannot be empty.");
    }

    if (checkForOverlaps(courses)) {
      errors.push("There is at least one course whose date range overlaps with another course.");
    }

    // VET Errors
    if (data?.payment_calculator?.type === 'vet' && data?.region?.code === 'online') {
      let intensiveCourse = 0;
      let standardCourse = 0;

      for (const course of courses) {
        if (!notEmpty) {
          notEmpty = Object.entries(course).every((field) => field[1]);
        }

        if (!course?.duration || course?.duration === "0") {
          courseWithoutDuration = true;
        }

        if (course?.coursePricing?.course?.type === 'intensive') intensiveCourse += 1;
        if (course?.coursePricing?.course?.type === 'standard') standardCourse += 1;
      }

      if (intensiveCourse === 1 && standardCourse === 0) {
        errors.push("We don't accept standalone INTENSIVE course.");
      }
    }

    // Elicos Errors
    if (data?.payment_calculator?.type === 'elicos') {
      let duration_weeks_day_courses_elicos = 0;
      let has_elicos_course = false;

      const {
        minimum_weeks
      } = getPaymentCalculatorParameters(data)?.restrictions;

      for (const course of courses) {
        if (data?.payment_calculator?.type === 'elicos' && minimum_weeks?.courses?.includes(course?.coursePricing?.course?.cricos_code)) {
          has_elicos_course = true;
          duration_weeks_day_courses_elicos += parseInt(course?.duration);
        }
      }

      if (
        has_elicos_course &&
        duration_weeks_day_courses_elicos < minimum_weeks?.quantiy_weeks) {
        errors.push(`The total duration of each course must be greater than ${minimum_weeks?.quantiy_weeks} weeks to be eligible for a payment plan (unless combined with other courses).`);
      }
    }

    // Aged Care
    if (data?.payment_calculator?.type === 'aged_care') {
      const paymentCalculatorParameters = JSON.parse(data?.payment_calculator?.parameters);
      const firstCourseCode = paymentCalculatorParameters?.course_order_selection?.first;
      const secondCourseCode = paymentCalculatorParameters?.course_order_selection?.second;
      const firstCourseName = data?.course_pricings?.find(coursePricing => coursePricing?.course?.course_code === firstCourseCode)?.course?.name;
      const secondCourseName = data?.course_pricings?.find(coursePricing => coursePricing?.course?.course_code === secondCourseCode)?.course?.name;

      const courseCodes = courses.map(course => course?.coursePricing?.course?.course_code);

      if (courseCodes?.length > 0 && courseCodes?.every(courseCode => firstCourseCode !== courseCode && secondCourseCode !== courseCode)) {
        errors.push(`There have to be at least a course which is either "${firstCourseName}" or "${secondCourseName}".`);
      } else if (courseCodes.includes(firstCourseCode) &&
        !courseCodes.includes(secondCourseCode) &&
        firstCourseCode !== courseCodes[0]) {
        errors.push(`The first course has to be "${firstCourseName}"`);
      } else if (courseCodes.includes(secondCourseCode) &&
        !courseCodes.includes(firstCourseCode) &&
        secondCourseCode !== courseCodes[0]) {
        errors.push(`The first course has to be "${secondCourseName}"`);
      } else if (courseCodes.includes(firstCourseCode) && 
        courseCodes.includes(secondCourseCode) &&  
        !(firstCourseCode === courseCodes[0] &&
        secondCourseCode === courseCodes[1])) {
          errors.push(`The order of the first and second course have to be "${firstCourseName}" and "${secondCourseName} respectively`);
      }
    }

    if (errors?.length > 0) {
      setApplicationEnabled(false);
    }

    setErrorMessage(errors);
  }, [data, courses]);

  useEffect(() => {
    if (data && !paymentType) {
      setPaymentType(getPaymentOptions(data, true)[0]?.code);
    }
  }, [data, paymentType]);

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

  const cleanPaymentPlan = () => {
    setPaymentPlan([]);
    setPaymentTableEnabled(false);
  }

  const createCourse = (course) => {
    let id = `${course?.coursePricing?.course?.id}-${counterCoursesAdded}`;
    setCounterCoursesAdded(counterCoursesAdded + 1);
    setCourses([...courses, { ...course, id }].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
    cleanPaymentPlan();
  };

  const updateCourse = (id, propName, newValue) => {
    const updatedItems = courses.map((item) => {
      if (item.id === id) {
        if (propName === 'startDate') {
          return {
            ...item,
            'startDate': newValue,
            'finishDate': formatDate(findFinishDateCourse(newValue, item?.duration), "yyyy-MM-dd")
          }
        } else if (propName === 'duration') {
          return {
            ...item,
            'duration': newValue,
            'finishDate': formatDate(findFinishDateCourse(item?.startDate, newValue), "yyyy-MM-dd")
          }
        }
        return { ...item, [propName]: newValue };
      }
      return item;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setCourses(updatedItems);
    cleanPaymentPlan();
  };

  const updateApplication = (propName, newValue) => {
    const updatedApplication = {
      ...application,
      [propName]: newValue
    };
    setApplication(updatedApplication);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
    cleanPaymentPlan();
  };

  const removeAllCourses = () => {
    setCourses([]);
    cleanPaymentPlan();
  }

  const resetApplication = () => {
    setApplication(defaultValuesApplication);
    setApplicationEnabled(false);
  }

  const resetAll = () => {
    removeAllCourses();
    resetApplication();
  }

  const createPaymentPlan = () => {
    const paymentPlan = generatePaymentPlan(data, courses, paymentType, specialCases);
    setPaymentPlan(paymentPlan);

    return paymentPlan;
  };

  const showPaymentPlanTable = () => {
    setPaymentTableEnabled(true);
    setApplicationEnabled(false);
    createPaymentPlan();
    scrollTo("payment_plan");
  }

  const showApplicationForm = () => {
    setPaymentTableEnabled(false);
    setApplicationEnabled(true);
    scrollTo("application");
  }

  if (error) return <div style={middleCenterStyle}><div>Failed to load <FontAwesomeIcon icon={faBug} /></div></div>
  if (isLoading) return (<div style={middleCenterStyle}>
    <div>
      <Spinner className="ms-3" animation="border" variant="dark" />
      <p>Loading...</p>
    </div>
  </div>)

  return (
    <Container>
      <Row className="mt-2">
        {
          data?.payment_calculator?.allow === 'external' && (<Col sm={12}>
            <Image src={hero_banner[`${data?.region?.code}_${data?.payment_calculator?.type}`]} fluid />
          </Col>)
        }
        <Col className="mt-2" sm={12}>
          <Card>
            {
              data?.payment_calculator?.allow === 'internal' && (<Card.Header>
                <h4 className="my-1">{data?.payment_calculator?.name}: {data?.region?.name}</h4>
              </Card.Header>)
            }
            {
              data?.payment_calculator?.allow === 'external' && (<Card.Body className="text-center m-1">
                <div dangerouslySetInnerHTML={{ __html: data?.external_message }} />
              </Card.Body>)
            }
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
            resetAll={resetAll}
          />
        </Col>
        <Col sm={8}>
          <ErrorAlert errorMessages={errorMessages} />
          <Courses
            courses={courses}
            updateCourse={updateCourse}
            removeCourse={removeCourse}
            removeAllCourses={removeAllCourses}
          />
        </Col>
      </Row>
      {paymentPlanTableEnabled &&
        <Row id="payment_plan">
          <Col>
            <PaymentPlan data={data} paymentPlan={paymentPlan} />
          </Col>
        </Row>
      }
      {applicationEnabled &&
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
      }

    </Container>
  );
}

export default App;