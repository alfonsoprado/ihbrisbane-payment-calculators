import { Card, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { findFinishDateCourse, formatDate } from "../helpers/dates";

function Courses({ courses, removeCourse, updateCourse, removeAllCourses }) {
  const handleChangeStartDate = (e, id) => {
    const { value } = e;
    updateCourse(id, "startDate", value);
  };

  return (
    <Card>
      <Card.Header><h5>Courses</h5></Card.Header>
      <Table className="mb-0" striped bordered hover>
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
              <td className="text-center align-middle">
                <b>
                  {course?.coursePricing?.course?.name}
                </b>
              </td>
              <td className="text-center align-middle">
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
              <td className="text-center align-middle">
                {course?.coursePricing?.course?.duration_weeks}
              </td>
              <td className="text-center align-middle">
                {course ? formatDate(findFinishDateCourse(course?.startDate, course?.coursePricing?.course?.duration_weeks), "yyyy-MM-dd") : ""}
              </td>
              <td className="text-center align-middle">
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
      {courses?.length > 0 && <Button
        className="rounded-botton"
        variant="danger"
        onClick={() => removeAllCourses()}
      >
        Remove All
      </Button>}
    </Card>
  );
}

export default Courses;
