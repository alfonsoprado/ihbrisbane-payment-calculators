import { faCircleInfo, faPassport, faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";

function ApplicationForm() {
    return <Form className="mb-3">
        <h4 className="mb-3">Application Form</h4>
        {/* Personal Information */}
        <Card className="mb-2">
            <Card.Header>
                <h5>
                    <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#990000" }} /> Personal Information
                </h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md>
                        <Form.Group className="mb-3">
                            <Form.Label><b>First Name:</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Last Name:</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Date of Birth:</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Nationality:</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Passport Number:</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Current Address:</b></Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Agency name (if applicable):</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Counselor name:</b></Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Counselor email:</b></Form.Label>
                            <Form.Control type="email" />
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Row className="mt-1 mb-2">
                            <Col><b>Gender:</b></Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                <Form.Check
                                    inline
                                    label="Not Given"
                                    name="group1"
                                    type="radio"
                                    id="inline-radio-1"
                                />
                                <Form.Check
                                    inline
                                    label="Yes"
                                    name="group1"
                                    type="radio"
                                    id="inline-radio-2"
                                />
                                <Form.Check
                                    inline
                                    label="No"
                                    name="group1"
                                    type="radio"
                                    id="inline-radio-3"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>Email:</b></Form.Label>
                                    <Form.Control type="email" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>Phone:</b></Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label><b>English Level:</b></Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option value="Not Given">Not Given</option>
                                        <option value="Elementary">Elementary</option>
                                        <option value="Pre-Intermediate">Pre-Intermediate</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Upper-Intermediate">Upper-Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <b>Do you have any disabilities and/or chronic conditions that may affect the way you complete the course?</b>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <div key="inline-radio">
                            <Form.Check
                                inline
                                label="Not Given"
                                name="group1"
                                type="radio"
                                id="inline-radio-1"
                            />
                            <Form.Check
                                inline
                                label="Yes"
                                name="group1"
                                type="radio"
                                id="inline-radio-2"
                            />
                            <Form.Check
                                inline
                                label="No"
                                name="group1"
                                type="radio"
                                id="inline-radio-3"
                            />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        {/* Visa Detail */}
        <Card className="mb-2">
            <Card.Header>
                <h5><FontAwesomeIcon icon={faPassport} style={{ color: "#990000" }} /> Visa Detail</h5>
            </Card.Header>
            <Card.Body>
                <Row className="mb-2">
                    <Col>
                        <b>Visa plan for above course(s):</b>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <div key="inline-radio">
                            <Form.Check
                                inline
                                label="Student"
                                name="group1"
                                type="radio"
                                id="inline-radio-1"
                            />
                            <Form.Check
                                inline
                                label="Business"
                                name="group1"
                                type="radio"
                                id="inline-radio-2"
                            />
                            <Form.Check
                                inline
                                label="Dependent"
                                name="group1"
                                type="radio"
                                id="inline-radio-3"
                            />
                            <Form.Check
                                inline
                                label="Other"
                                name="group1"
                                type="radio"
                                id="inline-radio-3"
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <b>Student Current Location:</b>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <div key="inline-radio">
                            <Form.Check
                                inline
                                label="Not Given"
                                name="group1"
                                type="radio"
                                id="inline-radio-1"
                            />
                            <Form.Check
                                inline
                                label="Onshore (in Australia)"
                                name="group1"
                                type="radio"
                                id="inline-radio-2"
                            />
                            <Form.Check
                                inline
                                label="Offshore (Outside of Australia)  "
                                name="group1"
                                type="radio"
                                id="inline-radio-3"
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <b>Which DHA office will you apply to for your visa? (student visa only)</b>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <div key="inline-radio">
                            <Form.Check
                                inline
                                label="Not Given"
                                name="group1"
                                type="radio"
                                id="inline-radio-1"
                            />
                            <Form.Check
                                inline
                                label="Onshore (in Australia)"
                                name="group1"
                                type="radio"
                                id="inline-radio-2"
                            />
                            <Form.Check
                                inline
                                label="Offshore (Outside of Australia)  "
                                name="group1"
                                type="radio"
                                id="inline-radio-3"
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col><b>Are you currently enrolled at another institution in Australia?</b></Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <div key="inline-radio">
                            <Form.Check
                                inline
                                label="Yes"
                                name="group1"
                                type="radio"
                                id="inline-radio-1"
                            />
                            <Form.Check
                                inline
                                label="No"
                                name="group1"
                                type="radio"
                                id="inline-radio-2"
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col><b>If YES, is this additional study you wish to undertake?</b></Col>
                </Row>
                <Row>
                    <Col>
                        <div key="inline-radio">
                            <Form.Check
                                inline
                                label="Yes"
                                name="group1"
                                type="radio"
                                id="inline-radio-1"
                            />
                            <Form.Check
                                inline
                                label="No (If No, a letter of release is required)"
                                name="group1"
                                type="radio"
                                id="inline-radio-2"
                            />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        {/* Insurance Detail */}
        <Card className="mb-3">
            <Card.Header>
                <h5><FontAwesomeIcon icon={faShieldHeart} style={{ color: "#990000" }} /> Insurance Detail</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Row className="mb-2">
                            <Col>
                                <b>OSHC</b> (<b>O</b>verseas <b>S</b>tudent <b>H</b>ealth <b>C</b>over - Compulsory requirement for student visa holder from arrival in Australia)
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col><b>Do you want IH Brisbane - ALS to arrange OSHC for you?</b></Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div key="inline-radio">
                                    <Form.Check
                                        inline
                                        label="No required"
                                        name="group1"
                                        type="radio"
                                        id="inline-radio-1"
                                    />
                                    <Form.Check
                                        inline
                                        label="Single"
                                        name="group1"
                                        type="radio"
                                        id="inline-radio-2"
                                    />
                                    <Form.Check
                                        inline
                                        label="Couple"
                                        name="group1"
                                        type="radio"
                                        id="inline-radio-2"
                                    />
                                    <Form.Check
                                        inline
                                        label="Family"
                                        name="group1"
                                        type="radio"
                                        id="inline-radio-2"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table bordered hover>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Single Rate</th>
                                            <th>Couple Rate</th>
                                            <th>Family Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>$50 per month</td>
                                            <td>$177 per month</td>
                                            <td>$258 per month</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        {/* Policy */}
        <Row>
            <Col>
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Group >
                            <Form.Check
                                type="checkbox"
                                id="agree1"
                                name="agree1"
                                label={<b>I have read and understood the IH Brisbane - ALS Student Handbook viewed <a target="_blank" rel="noreferrer" href="http://ihbrisbane.synology.me:81/?resource=doc&doc_no=52400150" style={{ color: "#990000" }}>here</a></b>}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                id="agree2"
                                name="agree2"
                                label={<b>I confirm that I have sufficient funds to pay for all tuition fees, accommodation and all other personal expenses during the full period of my course.</b>}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                id="agree3"
                                name="agree3"
                                label={<b>I certify that all information given by me in this application is accurate and correct.</b>}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                id="agree4"
                                name="agree4"
                                label={<b>I have read and understood the IH Brisbane - ALS <a target="_blank" rel="noreferrer" href="https://www.ihbrisbane.com.au/admission/refund-and-enrolment-policy/" style={{ color: "#990000" }}>here</a> and agree.</b>}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            {/* Create Application */}
            <Col>
                <div className="d-grid gap-2"><Button variant="dark" size="lg">Create Application</Button></div>
            </Col>
            {/* Reset Application */}
            {/* Agregar modal al boton */}
            <Col>
                <div className="d-grid gap-2">
                    <Button variant="danger" size="lg">Reset</Button>
                </div>
            </Col>
        </Row>
    </Form >
}

export default ApplicationForm;