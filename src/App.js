import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";
import Menu from "./Components/Menu/Menu";
import Courses from "./Components/Courses";
import PaymentPlan from "./Components/PaymentPlan";
import { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { generatePaymentPlan } from "./logic/payment-plan";
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { checkForOverlaps, findFinishDateCourse, formatDate } from "./helpers/dates";
import ApplicationForm from "./Components/ApplicationForm";
import { scrollTo } from "./helpers/tools";
import { PAYMENT_CALCULATOR_API_URL, hero_banner, payments_calculators } from "./env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

const fetcher = (url) => fetch(url).then((res) => res.json());

const defaultValuesApplication = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "Not Given",
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
  studentCurrentLocation: "Not Given",
  DHAOffice: "Not Given",
  enrolledAnotherInstitutionAustralia: "No",
  additionalStudy: "No",
  OSHC: "No required"
}

const middleCenterStyle = {
  position: 'absolute',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function App() {
  const [errorMessages, setErrorMessage] = useState([]);
  const [courses, setCourses] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [specialCases, setSpecialCases] = useState([]);

  const [paymentPlan, setPaymentPlan] = useState([]);
  const [paymentPlanTableEnabled, setPaymentTableEnabled] = useState(false);

  const [application, setApplication] = useState(defaultValuesApplication);
  const [applicationEnabled, setApplicationEnabled] = useState(false);

  const { payment_calculator } = useParams();
  const { data, error, isLoading } = useSWR(`${PAYMENT_CALCULATOR_API_URL}/${payments_calculators[payment_calculator]}`, fetcher)

  useEffect(() => {
    // General Errors
    let errors = [];
    let intensiveCourse = 0;
    let standardCourse = 0;
    let notEmpty = true;

    for (const course of courses) {
      if (!notEmpty) {
        notEmpty = Object.entries(course).every((field) => field[1]);
      }

      if (course?.coursePricing?.course?.type === 'intensive') intensiveCourse += 1;
      if (course?.coursePricing?.course?.type === 'standard') standardCourse += 1
    }

    if (!notEmpty) {
      errors.push("The fields of the courses cannot be empty.");
    }

    if (data?.region?.code === 'open_vet' && intensiveCourse > 0 && standardCourse === 0) {
      errors.push("We don't accept standalone INTENSIVE course.");
    }

    if (checkForOverlaps(courses)) {
      errors.push("There is at least one course whose date range overlaps with another course.");
    }

    if (errors?.length > 0) {
      setApplicationEnabled(false);
    }

    setErrorMessage(errors);
  }, [data, courses]);

  const cleanPaymentPlan = () => {
    setPaymentPlan([]);
    setPaymentTableEnabled(false);
  }

  const createCourse = (course) => {
    setCourses([...courses, { ...course, id: course?.coursePricing?.course?.id }].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
    cleanPaymentPlan();
  };

  const updateCourse = (id, propName, newValue) => {
    const updatedItems = courses.map((item) => {
      if (item.id === id) {
        if (propName === 'startDate') {
          return {
            ...item,
            'startDate': newValue,
            'finishDate': formatDate(findFinishDateCourse(newValue, item?.coursePricing?.course?.duration_weeks), "yyyy-MM-dd")
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
          data?.payment_calculator?.type === 'external' && (<Col sm={12}>
            <Image src={hero_banner[data?.region?.code]} fluid />
          </Col>)
        }
        <Col className="mt-2" sm={12}>
          <Card>
            {
              data?.payment_calculator?.type === 'internal' && (<Card.Header>
                <h4 className="my-1">{data?.payment_calculator?.name}: {data?.region?.name}</h4>
              </Card.Header>)
            }
            {
              data?.payment_calculator?.type === 'external' && (<Card.Body className="text-center m-1">
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

