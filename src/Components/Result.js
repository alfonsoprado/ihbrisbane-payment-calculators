import { Table } from "react-bootstrap";

function Result({ paymentPlan }) {
  if (paymentPlan?.length === 0) {
    return;
  }

  return (
    <>
      <h4>Payment Plan</h4>
      <Table className="m-2 mb-4" hover>
        <thead className="table-dark">
          <tr>
            <th>Due date</th>
            <th>Fee Description</th>
            <th>Course Name</th>
            <th>Payment Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentPlan.map((row) => (
            <tr key={row.id}>
              <td>{row.dueDate}</td>
              <td>{row.feeDescription}</td>
              <td>{row.courseName}</td>
              <td>${row.paymentAmount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Result;
