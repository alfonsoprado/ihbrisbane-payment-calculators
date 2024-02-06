import { Card, Table, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import {
  parse,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format
} from "date-fns";

export function findFridayOfFollowingWeeks(dateInitial, weeksInTheFuture = 0) {
  if (typeof dateInitial === "string") {
    dateInitial = parse(dateInitial, "yyyy-MM-dd", new Date());
  }
  const startOfTheWeek = startOfWeek(dateInitial, { weekStartsOn: 1 });
  const futureWeek = addWeeks(startOfTheWeek, weeksInTheFuture - 1);
  const fridayOfFutureWeek = addDays(futureWeek, 4);
  return format(fridayOfFutureWeek, "yyyy-MM-dd");
}

function Courses({ courses, removeCourse, updateCourse }) {
  const handleChangeDuration = (e, id) => {
    const { name, value } = e.target;
    updateCourse(id, name, value);
  };
  const handleChangeStartDate = (e, id) => {
    const { value } = e;
    updateCourse(id, "startDate", value);
  };

  return (
    <Card>
      <Card.Header><h5>Courses</h5></Card.Header>
      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Start date</th>
            <th>Duration</th>
            <th>End date</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 && (
            <tr className="text-center">
              <td colSpan={5}>Empty</td>
            </tr>
          )}
          {courses.map((course) => (
            <tr key={course?.id}>
              <td>
                <b>
                  {course?.coursePricing?.course?.name}
                </b>
              </td>
              <td>
              <Select 
                options={course?.coursePricing?.course?.start_dates?.map((start_date) => {
                  return {
                    value: start_date,
                    label: start_date
                  }
                })}
                value={{ label: course?.startDate, value: course?.startDate }}
                onChange={(e) => handleChangeStartDate(e, course.id)} 
                />
              </td>
              <td>
                <Form.Control
                  name="duration"
                  value={course?.duration}
                  isInvalid={!course?.duration}
                  onChange={(e) =>
                    handleChangeDuration(e, course.id)
                  }
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Weeks"
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  The field is required.
                </Form.Control.Feedback>
              </td>
              <td>
                {course ? findFridayOfFollowingWeeks(course?.startDate, course?.duration) : ""}
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => removeCourse(course.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default Courses;
