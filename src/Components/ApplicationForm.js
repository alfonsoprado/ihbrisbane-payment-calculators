import { faCircleInfo, faPassport, faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Card, Form, Row, Col, Table, Alert, InputGroup } from "react-bootstrap";
import DownloadPDF from "./DownloadPDFButton";
import { format, parseISO } from "date-fns";
import AppModal from "./AppModal";
import { ALS_STUDENT_HANDBOOK_URL, APPLICATION_FORM_PDF_API_URL, REFUND_ENROLMENT_POLICY_URL, VOCATIONAL_ENTRY_TEST_URL } from "../env";

function ApplicationForm({
    data,
    courses,
    paymentType,
    specialCases,
    application,
    updateApplication,
    resetApplication
}) {
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidCounselorEmail, setIsValidCounselorEmail] = useState(true);

    const [agree1, setAgree1] = useState(false);
    const [agree2, setAgree2] = useState(false);
    const [agree3, setAgree3] = useState(false);
    const [agree4, setAgree4] = useState(false);

    const agree = agree1 && agree2 && agree3 && agree4;
    const invalidApplicationForm = !(agree && isValidEmail && isValidCounselorEmail);

    const updateField = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (['email', 'counselorEmail'].includes(e.target.name)) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (e.target.name === 'email') {
                if (value?.trim() === "") {
                    setIsValidEmail(true);
                } else {
                    setIsValidEmail(re.test(value));
                }
            } else if (e.target.name === 'counselorEmail') {
                if (value?.trim() === "") {
                    setIsValidCounselorEmail(true);
                } else {
                    setIsValidCounselorEmail(re.test(value));
                }
            }
        }
        updateApplication(name, value);
    }

    const generateDataPDF = () => {
        return {
            regionCode: data?.region?.code,
            paymentType: data?.payment_options?.find(option => option.code === paymentType)?.name,
            application,
            specialCases,
            courses: courses.map(course => ({
                name: course?.coursePricing?.course?.name,
                cricosCode: course?.coursePricing?.course?.cricos_code,
                courseCode: course?.coursePricing?.course?.course_code,
                startDate: format(parseISO(course?.startDate), "dd/MM/yyyy")
            }))
        };
    }

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
                            <Form.Control
                                name="firstName"
                                value={application?.firstName}
                                onChange={updateField}
                                type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Last Name:</b></Form.Label>
                            <Form.Control
                                name="lastName"
                                value={application?.lastName}
                                onChange={updateField}
                                type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Date of Birth:</b></Form.Label>
                            <Form.Control
                                name="dateOfBirth"
                                value={application?.dateOfBirth}
                                onChange={updateField}
                                type="date" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Nationality:</b></Form.Label>
                            <Form.Control
                                name="nationality"
                                value={application?.nationality}
                                onChange={updateField}
                                type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Passport Number:</b></Form.Label>
                            <Form.Control
                                name="passportNumber"
                                value={application?.passportNumber}
                                onChange={updateField}
                                type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Current Address:</b></Form.Label>
                            <Form.Control
                                as="textarea"
                                name="currentAddress"
                                value={application?.currentAddress}
                                onChange={updateField}
                                rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Agency name (if applicable):</b></Form.Label>
                            <Form.Control
                                name="agencyName"
                                value={application?.agencyName}
                                onChange={updateField}
                                type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Counselor name:</b></Form.Label>
                            <Form.Control
                                name="counselorName"
                                value={application?.counselorName}
                                onChange={updateField}
                                type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Counselor email:</b></Form.Label>
                            <Form.Control
                                name="counselorEmail"
                                value={application?.counselorEmail}
                                onChange={updateField}
                                isInvalid={!isValidCounselorEmail}
                                type="email" />
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
                                    name="gender"
                                    value="Not Given"
                                    checked={application?.gender === 'Not Given'}
                                    onChange={updateField}
                                    type="radio"
                                />
                                <Form.Check
                                    inline
                                    label="Male"
                                    name="gender"
                                    value="Male"
                                    checked={application?.gender === 'Male'}
                                    onChange={updateField}
                                    type="radio"
                                />
                                <Form.Check
                                    inline
                                    label="Female"
                                    name="gender"
                                    value="Female"
                                    checked={application?.gender === 'Female'}
                                    onChange={updateField}
                                    type="radio"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>Email:</b></Form.Label>
                                    <Form.Control
                                        name="email"
                                        value={application?.email}
                                        onChange={updateField}
                                        isInvalid={!isValidEmail}
                                        type="email" />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label><b>Phone:</b></Form.Label>
                                    <Form.Control
                                        name="phone"
                                        value={application?.phone}
                                        onChange={updateField}
                                        type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label><b>English Level:</b></Form.Label>
                                    <Form.Select
                                        name="englishLevel"
                                        value={application.englishLevel}
                                        onChange={updateField}
                                    >
                                        <option value="Not Given">Not Given</option>
                                        <option value="Elementary">Elementary</option>
                                        <option value="Pre-Intermediate">Pre-Intermediate</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Upper-Intermediate">Upper-Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </Form.Select>
                                    <Form.Text id="passwordHelpBlock" muted>
                                        Not met the English requirement? student to do the entry test at <a href={VOCATIONAL_ENTRY_TEST_URL} target="_blank" rel="noreferrer">Vocational Entry Test</a>.
                                    </Form.Text>
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
                        <Form.Check
                            inline
                            label="Not Given"
                            name="disabilitiesChronicConditions"
                            value="Not Given"
                            checked={application?.disabilitiesChronicConditions === 'Not Given'}
                            onChange={updateField}
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="Yes"
                            name="disabilitiesChronicConditions"
                            value="Yes"
                            checked={application?.disabilitiesChronicConditions === 'Yes'}
                            onChange={updateField}
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="No"
                            name="disabilitiesChronicConditions"
                            value="No"
                            checked={application?.disabilitiesChronicConditions === 'No'}
                            onChange={updateField}
                            type="radio"
                        />
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
                    <Col className="d-flex justify-content-between">
                        <Form.Check
                            inline
                            label="Student"
                            name="visa"
                            value="Student"
                            checked={application?.visa === 'Student'}
                            onChange={updateField}
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="Business"
                            name="visa"
                            value="Business"
                            checked={application?.visa === 'Business'}
                            onChange={updateField}
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="Dependent"
                            name="visa"
                            value="Dependent"
                            checked={application?.visa === 'Dependent'}
                            onChange={updateField}
                            type="radio"
                        />
                        <InputGroup>
                            <InputGroup.Radio
                                name="visa"
                                value=""
                                onChange={updateField}
                                checked={!["Student", "Business", "Dependent"].includes(application?.visa)} />
                            <InputGroup.Text>Other</InputGroup.Text>
                            <Form.Control
                                name="visa"
                                type="text"
                                onChange={updateField}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {
                    application?.visa === 'Student' && <>
                        <Row className="mb-2">
                            <Col>
                                <b>Student Current Location:</b>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Check
                                    inline
                                    label="Onshore (in Australia)"
                                    name="studentCurrentLocation"
                                    value="Onshore"
                                    checked={application?.studentCurrentLocation === 'Onshore'}
                                    onChange={updateField}
                                    type="radio"
                                />
                                <Form.Check
                                    inline
                                    label="Offshore (Outside of Australia)  "
                                    name="studentCurrentLocation"
                                    value="Offshore"
                                    checked={application?.studentCurrentLocation === 'Offshore'}
                                    onChange={updateField}
                                    type="radio"
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <b>Which DHA office will you apply to for your visa? (student visa only)</b>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Check
                                    inline
                                    label="Onshore (in Australia)"
                                    name="DHAOffice"
                                    value="Onshore"
                                    checked={application?.DHAOffice === 'Onshore'}
                                    onChange={updateField}
                                    type="radio"
                                />
                                <Form.Check
                                    inline
                                    label="Offshore (Outside of Australia)"
                                    name="DHAOffice"
                                    value="Offshore"
                                    checked={application?.DHAOffice === 'Offshore'}
                                    onChange={updateField}
                                    type="radio"
                                />
                            </Col>
                        </Row>
                    </>
                }
                <Row className="mb-2">
                    <Col><b>Are you currently enrolled at another institution in Australia?</b></Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Check
                            inline
                            label="Yes"
                            name="enrolledAnotherInstitutionAustralia"
                            value="Yes"
                            checked={application?.enrolledAnotherInstitutionAustralia === 'Yes'}
                            onChange={updateField}
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="No"
                            name="enrolledAnotherInstitutionAustralia"
                            value="No"
                            checked={application?.enrolledAnotherInstitutionAustralia === 'No'}
                            onChange={updateField}
                            type="radio"
                        />
                    </Col>
                </Row>
                {
                    application?.enrolledAnotherInstitutionAustralia === 'Yes' && <>
                        <Row className="mb-2">
                            <Col><b>If YES, is this additional study you wish to undertake?</b></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Check
                                    inline
                                    label="Yes"
                                    name="additionalStudy"
                                    value="Yes"
                                    checked={application?.additionalStudy === 'Yes'}
                                    onChange={updateField}
                                    type="radio"
                                />
                                <Form.Check
                                    inline
                                    label="No"
                                    name="additionalStudy"
                                    value="No"
                                    checked={application?.additionalStudy === 'No'}
                                    onChange={updateField}
                                    type="radio"
                                />
                            </Col>
                        </Row>
                    </>
                }
                <Row className="mb-2">
                    <Col><b>Have you previoulsy held a visa for Australia?</b></Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Check
                            inline
                            label="Yes"
                            name="havePrevioulsyHeldVisaAustralia"
                            value="Yes"
                            checked={application?.havePrevioulsyHeldVisaAustralia === 'Yes'}
                            onChange={updateField}
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="No"
                            name="havePrevioulsyHeldVisaAustralia"
                            value="No"
                            checked={application?.havePrevioulsyHeldVisaAustralia === 'No'}
                            onChange={updateField}
                            type="radio"
                        />
                    </Col>
                </Row>
                <Row>
                    {
                        application?.havePrevioulsyHeldVisaAustralia === 'Yes' && <Form.Group className="mb-3">
                            <Form.Label><b>Please detail your Australian immigration history here (visa types held, and dates to / from):</b></Form.Label>
                            <Form.Control
                                as="textarea"
                                name="previousVisaAustraliaDetails"
                                onChange={updateField}
                                rows={3} />
                        </Form.Group>
                    }
                </Row>
            </Card.Body>
        </Card>
        {/* Insurance Detail */}
        {
            application?.visa === 'Student' && <Card className="mb-3">
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
                                    <Form.Check
                                        inline
                                        label="No required"
                                        name="OSHC"
                                        value="No required"
                                        checked={application?.OSHC === 'No required'}
                                        onChange={updateField}
                                        type="radio"
                                    />
                                    <Form.Check
                                        inline
                                        label="Single"
                                        name="OSHC"
                                        value="Single"
                                        checked={application?.OSHC === 'Single'}
                                        onChange={updateField}
                                        type="radio"
                                    />
                                    <Form.Check
                                        inline
                                        label="Couple"
                                        name="OSHC"
                                        value="Couple"
                                        checked={application?.OSHC === 'Couple'}
                                        onChange={updateField}
                                        type="radio"
                                    />
                                    <Form.Check
                                        inline
                                        label="Family"
                                        name="OSHC"
                                        value="Family"
                                        checked={application?.OSHC === 'Family'}
                                        onChange={updateField}
                                        type="radio"
                                    />
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
                                                <td>${data?.payment_calculator?.oshc?.single_rate} per month</td>
                                                <td>${data?.payment_calculator?.oshc?.couple_rate} per month</td>
                                                <td>${data?.payment_calculator?.oshc?.family_rate} per month</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        }
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
                                checked={agree1}
                                onChange={() => setAgree1(!agree1)}
                                label={<b>I have read and understood the IH Brisbane - ALS Student Handbook viewed <a target="_blank" rel="noreferrer" href={ALS_STUDENT_HANDBOOK_URL} style={{ color: "#990000" }}>here</a></b>}
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
                                checked={agree2}
                                onChange={() => setAgree2(!agree2)}
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
                                checked={agree3}
                                onChange={() => setAgree3(!agree3)}
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
                                checked={agree4}
                                onChange={() => setAgree4(!agree4)}
                                label={<b>I have read and understood the IH Brisbane - ALS <a target="_blank" rel="noreferrer" href={REFUND_ENROLMENT_POLICY_URL} style={{ color: "#990000" }}>here</a> and agree.</b>}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {
            !agree && <Row>
                <Col>
                    <Alert variant="danger">
                        Please note that you must accept our Terms and Conditions before proceeding. By agreeing, you acknowledge that you have read, understood, and consented to our policies.
                    </Alert>
                </Col>
            </Row>
        }
        <Row>
            {/* Create Application */}
            <Col>
                <div className="d-grid gap-2">
                    <DownloadPDF
                        url={APPLICATION_FORM_PDF_API_URL}
                        generateDataPDF={generateDataPDF}
                        title="Application Form"
                        buttonText="Complete Application"
                        disabled={invalidApplicationForm} />
                </div>
            </Col>
            {/* Reset Application */}
            <Col>
                <div className="d-grid gap-2">
                    <AppModal
                        title="Reset Application"
                        content="Are you sure you want to reset the application?"
                        actionTextButton="Reset Application"
                        actionVariantButton="danger"
                        showTextButton="Reset Application"
                        showVariantButton="danger"
                        onAction={resetApplication}
                    />
                </div>
            </Col>
        </Row>
    </Form >
}

export default ApplicationForm;