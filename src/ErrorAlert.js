import { Alert } from "react-bootstrap";

function ErrorAlert({ errorMessages }) {
  if (errorMessages?.length === 0) {
    return;
  }

  return (
    <Alert key="danger" variant="danger">
      <ul className="m-0">
        {errorMessages.map((error) => (
          <li key={error}>{error?.message}</li>
        ))}
      </ul>
    </Alert>
  );
}

export default ErrorAlert;
