import { Container, Row, Col } from "react-bootstrap";
import Menu from "./Components/Menu/Menu";
import Courses from "./Components/Courses";
import Result from "./Components/Result";
import { useEffect, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { generatePaymentPlan } from "./helpers/payment-plan";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());


function App() {
  const { data, error, isLoading } = useSWR('http://localhost/apps/public/api/paymentcalculator/9b448570-87a2-4ccd-be7c-7a38cc42fe7b?internal=d1efad72dc5b17dc66a46767c32fff40', fetcher)

  //
  const [errorMessages, setErrorMessage] = useState([]);
  /*
  e.g.
  [
    {
      name: "Certificate I in Retail", 
      startDate: "30/10/2023", 
      // duration: "33", 
      price: "5000"
    }
  ]
  */
  const [courses, setCourses] = useState([]);
  /*
    e.g.
    [{
      id: 1,
      dueDate: '30/10/2023',
      feeDescription: 'Payment Plan',
      courseName: '',
      paymentAmount: '$100',
    },
    {
      id: 2,
      dueDate: '30/10/2023',
      feeDescription: 'Tuition',
      courseName: 'Certificate I in Retail',
      paymentAmount: '$500',
    }]
  */
  const [paymentPlan, setPaymentPlan] = useState([]);

  const createCourse = (course) => {
    setCourses([...courses, { ...course, id: course?.coursePricing?.course?.id }].sort((a, b) => a?.coursePricing?.course?.order - b?.coursePricing?.course?.order));
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

  // Calculation here
  /*
    paymentType -> option1, option2
    specialCases -> { formalStudent: false, payAtOnce: false }
  */
  const createPaymentPlan = (paymentType, specialCases) => {
    const paymentPlan = generatePaymentPlan(data, courses, paymentType, specialCases);
    setPaymentPlan(paymentPlan);
  };

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

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <Container>
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
