import { Table } from "react-bootstrap";

function Result({ data, paymentPlan }) {
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
            {
              (data?.payment_calculator?.type === 'internal' || data?.region?.code === 'latin_america_europe') && <th>Course Name</th>
            }
            <th>Payment Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentPlan.map((row) => (
            <tr key={row.id}>
              <td>{row.dueDate}</td>
              <td>{row.feeDescription}</td>
              {
                (data?.payment_calculator?.type === 'internal' || data?.region?.code === 'latin_america_europe') && <td>{row.courseName}</td>
              }
              <td>${row.paymentAmount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Result;
