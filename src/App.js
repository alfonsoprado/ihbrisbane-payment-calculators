import { Container, Row, Col, Card, Image } from "react-bootstrap";
import Menu from "./Components/Menu/Menu";
import Courses from "./Components/Courses";
import PaymentPlan from "./Components/PaymentPlan";
import { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { generatePaymentPlan } from "./logic/payment-plan";
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { checkForOverlaps, findFinishDateCourse, formatDate } from "./helpers/dates";

const fetcher = (url) => fetch(url).then((res) => res.json());

const API_URL = "http://localhost/apps/public/api/paymentcalculator";

const payments_calculators = {
  internal_asian_all_other_countries: '9b4aebb7-dc5c-452b-80d1-e50aeb35db08?internal=d1efad72dc5b17dc66a46767c32fff40',
  internal_latin_america_europe: '9b4aebb7-e9d5-41f2-bfd6-fb2cc18ca806?internal=d1efad72dc5b17dc66a46767c32fff40',
  internal_open_vet: '9b4aebb7-ec4e-4c04-af3b-4a963a14499d?internal=d1efad72dc5b17dc66a46767c32fff40',
  external_asian_all_other_countries: '9b4aebb7-dc5c-452b-80d1-e50aeb35db08',
  external_latin_america_europe: '9b4aebb7-e9d5-41f2-bfd6-fb2cc18ca806',
  external_open_vet: '9b4aebb7-ec4e-4c04-af3b-4a963a14499d',
};

const hero_banner = {
  asian_all_other_countries: "http://localhost/apps/public/images/payment_calculator/in-person_vet_courses.png",
  latin_america_europe: "http://localhost/apps/public/images/payment_calculator/in-person_vet_courses.png",
  open_vet: "http://localhost/apps/public/images/payment_calculator/online_vet_courses.png"
}

function App() {
  const [errorMessages, setErrorMessage] = useState([]);
  const [courses, setCourses] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const [paymentPlanTableEnabled, setPaymentTableEnabled] = useState(false);
  const { payment_calculator } = useParams();
  const { data, error, isLoading } = useSWR(`${API_URL}/${payments_calculators[payment_calculator]}`, fetcher)

  useEffect(() => {
    let errors = [];
    let intensiveCourse = 0;
    let standardCourse = 0;
    let notEmpty = true;
    // Check for required inputs
    for (const course of courses) {
      if (!notEmpty) {
        notEmpty = Object.entries(course).every((field) => field[1]);
      }
      
      if(course?.coursePricing?.course?.type === 'intensive') intensiveCourse += 1;
      if(course?.coursePricing?.course?.type === 'standard') standardCourse += 1
    }

    if (!notEmpty) {
      errors.push("The fields of the courses cannot be empty.");
    }

    if (data?.region?.code === 'open_vet' && intensiveCourse > 0 && standardCourse === 0) {
      errors.push("We don't accept standalone INTENSIVE course.");
    }

    if(checkForOverlaps(courses)) {
      errors.push("There is at least one course whose date range overlaps with another course.");
    }

    // startDate1 < startDate2
    // startDate1 + duration1 < startDate2 + duration2 < ....
    
    // checkForOverlaps(dateRanges)

    setErrorMessage(errors);
  }, [data, courses]);

  const cleanPaymentPlan = () => {
    setPaymentPlan([]);
    setPaymentTableEnabled(false);
    window.location.hash = "footer";
  }

  const createCourse = (course) => {
    setCourses([...courses, { ...course, id: course?.coursePricing?.course?.id }]);
    cleanPaymentPlan();
  };

  const updateCourse = (id, propName, newValue) => {
    const updatedItems = courses.map((item) => {
      if (item.id === id) {
        if(propName === 'startDate') {
          return { 
            ...item, 
            'startDate': newValue, 
            'finishDate': formatDate(findFinishDateCourse(newValue, item?.coursePricing?.course?.duration_weeks), "yyyy-MM-dd")
          }
        }
        return { ...item, [propName]: newValue };
      }
      return item;
    });
    setCourses(updatedItems);
    cleanPaymentPlan();
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
    cleanPaymentPlan();
  };

  const removeAllCourses = () => {
    setCourses([]);
    cleanPaymentPlan();
  }

  const createPaymentPlan = (paymentType, specialCases) => {
    const paymentPlan = generatePaymentPlan(data, courses, paymentType, specialCases);
    setPaymentPlan(paymentPlan);

    return paymentPlan;
  };

  const showPaymentPlanTable = (paymentType, specialCases) => {
    setPaymentTableEnabled(true);
    createPaymentPlan(paymentType, specialCases);
    setTimeout(() => {
      window.location.hash = "payment_plan";
    }, 0);
  }

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

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
            courses={courses}
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
      { paymentPlanTableEnabled && 
        <Row id="payment_plan">
          <PaymentPlan data={data} paymentPlan={paymentPlan}></PaymentPlan>
        </Row>
      }
      <div id="footer" />
    </Container>
  );
}

export default App;
