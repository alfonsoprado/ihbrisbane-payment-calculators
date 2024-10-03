import { Alert } from "react-bootstrap";

function SuccessAlert({ message }) {
  if (!message) {
    return;
  }

  return (
    <Alert key="danger" variant="success">
      {message}
    </Alert>
  );
}

export default SuccessAlert;
