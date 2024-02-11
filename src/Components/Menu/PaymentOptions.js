import { Card, Form, Row, Col, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { getPaymentOptions, getSpecialCases } from "../../helpers/tools";
import DownloadPDF from "../DownloadPDFButton";
import { parseISO, format } from 'date-fns';
import AppModal from "../AppModal";
import { PAYMENT_PLAN_PDF_API_URL } from "../../env";

function PaymentOptions({
  data,
  errorMessages,
  createPaymentPlan,
  courses,
  showPaymentPlanTable,
  cleanPaymentPlan,
  showApplicationForm,
  paymentType,
  updatePaymentType,
  specialCases,
  updateSpecialCases,
  resetAll
}) {
  const generateDataPDF = () => {
    const paymentPlan = createPaymentPlan();
    const dataPDF = {
      regionCode: data?.region?.code,
      courses: courses.map(course => {
        return {
          name: course?.coursePricing?.course?.name,
          cricosCode: course?.coursePricing?.course?.cricos_code,
          courseCode: course?.coursePricing?.course?.course_code,
          startDate: format(parseISO(course?.startDate), "dd/MM/yyyy"),
          finishDate: format(parseISO(course?.finishDate), "dd/MM/yyyy")
        }
      }),
      paymentPlan: paymentType === "pay_upfront" ? paymentPlan : paymentPlan.filter(row => row.code !== "tuition")
    }
    return dataPDF;
  }

  const handlePaymentType = (event) => {
    updatePaymentType(event.target.value);
    cleanPaymentPlan();
  };

  const handleSpecialCases = (event) => {
    const { name, checked } = event.target;
    if (checked && !specialCases.includes(name)) {
      updateSpecialCases([...specialCases, name]);
    } else {
      updateSpecialCases(specialCases?.filter(specialCase => specialCase !== name));
    }
    cleanPaymentPlan();
  };

  const handlePaymentPlan = () => {
    showPaymentPlanTable();
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
          >
            Check Payment Plan
          </Button>
          <DownloadPDF
            url={PAYMENT_PLAN_PDF_API_URL}
            generateDataPDF={generateDataPDF}
            title="Payment Plan"
            disabled={buttonDisable} />
          <Button
            variant="dark"
            disabled={buttonDisable}
            onClick={showApplicationForm}
          >Complete Application Details</Button>
          <AppModal
            title="Reset All"
            content="Are you sure you want to reset all?"
            actionTextButton="Reset All"
            actionVariantButton="danger"
            showTextButton="Reset All"
            showVariantButton="danger"
            onAction={resetAll}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default PaymentOptions;
