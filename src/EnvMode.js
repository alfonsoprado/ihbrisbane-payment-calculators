import { useState } from "react";
import Select from 'react-select';
import App from "./App";
import { payments_calculators } from "./env";
import { Col, Container, Row } from "react-bootstrap";

export const ENV = process.env.NODE_ENV;

const options = Object.keys(payments_calculators);

function EnvMode() {
    const [paymentCalculator, setPaymentCalculator] = useState(options[0]);

    if (ENV === 'production') {
        return <App />;
    } else {
        return (<>
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Select
                            options={options.map((option) => {
                                return {
                                    value: option,
                                    label: option
                                }
                            })}
                            value={paymentCalculator.value}
                            onChange={(e) => {
                                setPaymentCalculator(e.value)
                            }}
                        />
                    </Col>
                </Row>
            </Container>
            <App paymentCalculator={paymentCalculator} />
        </>);
    }
}

export default EnvMode;

