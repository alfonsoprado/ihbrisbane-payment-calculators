import { useState } from "react";
import { Card, Form, Row, Col, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { getPaymentOptions, getSpecialCases } from "../../helpers/tools";
import DownloadPdf from "./DownloadButton";
import { findFinishDateCourse, formatDate } from "../../helpers/dates";
import { parseISO, format } from 'date-fns';

function PaymentOptions({ data, errorMessages, createPaymentPlan, courses, paymentPlan, showPaymentPlanTable, cleanPaymentPlan }) {
  const [paymentType, setPaymentType] = useState("");
  const [specialCases, setSpecialCases] = useState([]);

  const generateDataPDF = () => {
    createPaymentPlan(paymentType, specialCases);
    const dataPDF = {
      //paymentCalculatorType: data?.payment_calculator?.type,
      regionCode: data?.region?.code,
      courses: courses.map(course => {
        return {
          name: course?.coursePricing?.course?.name,
          startDate: format(parseISO(course?.startDate), "dd/MM/yyyy"),
          finishDate: formatDate(findFinishDateCourse(course?.startDate, course?.coursePricing?.course?.duration_weeks))
        }
      }),
      paymentPlan: paymentPlan
    }
    return dataPDF;
  }

  const handlePaymentType = (event) => {
    setPaymentType(event.target.value);
    cleanPaymentPlan();
  };

  const handleSpecialCases = (event) => {
    const { name, checked } = event.target;
    if (checked && !specialCases.includes(name)) {
      setSpecialCases([...specialCases, name]);
    } else {
      setSpecialCases(specialCases?.filter(specialCase => specialCase !== name));
    }
    cleanPaymentPlan();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handlePaymentPlan = () => {
    showPaymentPlanTable(paymentType, specialCases);
  }

  const buttonDisable = errorMessages?.length > 0 ||
    !paymentType ||
    courses?.length === 0;

  return (
    <Card id="payment_options" className="mb-3">
      <Card.Header>
        <h4>Payment Options</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label><b>Payment Type</b></Form.Label>
                {
                  courses.length > 1 ? getPaymentOptions(data, true).map(option => {
                    return (
                      <Form.Check
                        key={option.code}
                        type="radio"
                        value={option.code}
                        checked={paymentType === option.code}
                        onChange={handlePaymentType}
                        label={option.name}
                        name="radios"
                        id={option.code}
                      />
                    )
                  }) : getPaymentOptions(data, false).map((option) => {
                    return (
                      <Form.Check
                        key={option.code}
                        type="radio"
                        value={option.code}
                        checked={paymentType === option.code}
                        onChange={handlePaymentType}
                        label={option.name}
                        name="radios"
                        id={option.code}
                      />
                    )
                  })
                }
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>Special Cases</b></Form.Label>
                {
                  getSpecialCases(data, courses).map((specialCase) => {
                    return (
                      <OverlayTrigger
                        key={specialCase?.code}
                        placement='left'
                        overlay={
                          <Tooltip id='tooltip-left'>
                            {specialCase?.info}
                          </Tooltip>
                        }
                      >
                        <Form.Group className="mb-3" controlId={specialCase?.code}>
                          <Form.Check
                            type="checkbox"
                            name={specialCase?.code}
                            label={specialCase?.name}
                            checked={specialCases.includes(specialCase?.code)}
                            onChange={handleSpecialCases}
                          />
                        </Form.Group>
                      </OverlayTrigger>
                    );
                  })
                }
              </Form.Group>
            </Col>
          </Row>
          <div className="d-grid gap-2">
            <Button
              onClick={handlePaymentPlan}
              disabled={buttonDisable}
              className="mt-2"
              variant="dark"
              type="submit"
            >
              Check Payment Plan
            </Button>
            <DownloadPdf
              url="http://localhost/apps/public/api/paymentcalculator/pdf/paymentplan"
              generateDataPDF={generateDataPDF}
              title="Payment Plan"
              disabled={buttonDisable} />
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PaymentOptions;
