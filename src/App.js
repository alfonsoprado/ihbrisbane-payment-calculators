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

const options = {
  asian_all_other_countries: '9b4834ce-0070-448b-a59a-3a1c993a5bd4?internal=d1efad72dc5b17dc66a46767c32fff40',
  latin_america_europe: '9b4834ce-0e31-4c65-8363-4c38e84468a3?internal=d1efad72dc5b17dc66a46767c32fff40',
  open_vet: '9b4834ce-10b1-492b-8a09-f32f73569d0e?internal=d1efad72dc5b17dc66a46767c32fff40',
};

function App() {
  const [errorMessages, setErrorMessage] = useState([]);
  const [courses, setCourses] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const { option } = useParams();
  const { data, error, isLoading } = useSWR(`http://localhost/apps/public/api/paymentcalculator/${options[option]}`, fetcher)

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
  
  if (!isLoading && !error) {
    console.debug("Data", data);
  }

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
