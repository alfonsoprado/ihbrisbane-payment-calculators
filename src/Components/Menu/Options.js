import { useState } from "react";
import { Card, Form, Row, Col, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { getPaymentOptions, getSpecialCases } from "../../helpers/tools";

function Options({ data, errorMessages, createPaymentPlan, courses }) {
  const [paymentType, setPaymentType] = useState("");
  const [specialCases, setSpecialCases] = useState([]);

  const handlePaymentType = (event) => {
    setPaymentType(event.target.value);
  };

  const handleSpecialCases = (event) => {
    const { name, checked } = event.target;
    if(checked && !specialCases.includes(name)) {
      setSpecialCases([...specialCases, name]);
    } else {
      setSpecialCases(specialCases?.filter(specialCase => specialCase != name));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPaymentPlan(paymentType, specialCases);
  };

  return (
    <Card className="mb-3">
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
                  getPaymentOptions(data).map((option) => {
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
              disabled={
                errorMessages?.length > 0 ||
                !paymentType ||
                courses?.length === 0
              }
              className="mt-2"
              variant="dark"
              type="submit"
            >
              Check Payment Plan
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Options;
