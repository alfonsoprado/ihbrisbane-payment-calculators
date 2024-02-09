import { Container, Row, Col, Card } from "react-bootstrap";
import Menu from "./Components/Menu/Menu";
import Courses from "./Components/Courses";
import Result from "./Components/Result";
import { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { generatePaymentPlan } from "./logic/payment-plan";
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const API_URL = "http://localhost/apps/public/api/paymentcalculator";

const options = {
  internal_asian_all_other_countries: '9b495bf6-470c-475e-847d-bfbc81f80f7e?internal=d1efad72dc5b17dc66a46767c32fff40',
  internal_latin_america_europe: '9b495bf6-4c8c-43c4-9a29-5bb283194c24?internal=d1efad72dc5b17dc66a46767c32fff40',
  internal_open_vet: '9b495bf6-4dbc-4248-ac94-5214fbbff753?internal=d1efad72dc5b17dc66a46767c32fff40',
  external_asian_all_other_countries: '9b495bf6-470c-475e-847d-bfbc81f80f7e',
  external_latin_america_europe: '9b495bf6-4c8c-43c4-9a29-5bb283194c24',
  external_open_vet: '9b495bf6-4dbc-4248-ac94-5214fbbff753',
};

function App() {
  const [errorMessages, setErrorMessage] = useState([]);
  const [courses, setCourses] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const { option } = useParams();
  const { data, error, isLoading } = useSWR(`${API_URL}/${options[option]}`, fetcher)

  useEffect(() => {
    let errors = [];

    // Check for required inputs
    for (const course of courses) {
      const notEmpty = Object.entries(course).every((field) => field[1]);
      if (!notEmpty) {
        errors.push("The fields of the courses cannot be empty.");
        break;
      }
    }

    // startDate1 < startDate2
    // startDate1 + duration1 < startDate2 + duration2 < ....

    setErrorMessage(errors);
  }, [courses]);

  const createCourse = (course) => {
    setCourses([...courses, { ...course, id: course?.coursePricing?.course?.id }]
      //.sort((a, b) => a?.coursePricing?.course?.order - b?.coursePricing?.course?.order)
    );
  };

  const updateCourse = (id, propName, newValue) => {
    const updatedItems = courses.map((item) => {
      if (item.id === id) {
        return { ...item, [propName]: newValue };
      }
      return item;
    });
    setCourses(updatedItems);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
    setPaymentPlan([]);
  };

  const removeAllCourses = () => {
    setCourses([]);
    setPaymentPlan([]);
  }

  const createPaymentPlan = (paymentType, specialCases) => {
    const paymentPlan = generatePaymentPlan(data, courses, paymentType, specialCases);
    setPaymentPlan(paymentPlan);
  };

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <Container>
      <Row className="mt-2">
        <Col sm={12}>
          <Card>
            <Card.Body>
              <h4 className="my-1">{data?.payment_calculator?.name}: {data?.region?.name}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={4}>
          <Menu
            data={data}
            createCourse={createCourse}
            errorMessages={errorMessages}
            createPaymentPlan={createPaymentPlan}
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
      <Row>
        <Result paymentPlan={paymentPlan}></Result>
      </Row>
    </Container>
  );
}

export default App;
