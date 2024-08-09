import { Card, Table, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { findFinishDateCourse, formatDate, changeFormat } from "../helpers/dates";
import AppModal from "./AppModal";

function Courses({ data, courses, removeCourse, updateCourse, removeAllCourses }) {
  const handleChangeStartDate = (e, id) => {
    const { value } = e;
    updateCourse(id, "startDate", value);
  };

  const handleChangeDuration = (e, id) => {
    const { name, value } = e.target;
    updateCourse(id, name, value);
  };

  const durationField = (course) => {
    if (!course?.coursePricing?.course?.duration_weeks) {
      if (course?.coursePricing?.course?.start_dates_with_weeks?.length > 0) {
        return <td className="text-center align-middle">
          {course?.coursePricing?.course?.start_dates_with_weeks?.find(obj => obj.start_date === course?.startDate)?.duration_weeks}
        </td>;
      } else {
        return <td>
          <Form.Control
            name="duration"
            value={course?.duration}
            isInvalid={!course?.duration}
            onChange={(e) =>
              handleChangeDuration(e, course.id)
            }
            type="number"
            min={course?.coursePricing?.course?.minimum_duration_weeks || 1}
            step="1"
            placeholder="Weeks"
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            The field is required.
          </Form.Control.Feedback>
        </td>;
      }
    } else {
      return <td className="text-center align-middle">
        {course?.coursePricing?.course?.duration_weeks}
      </td>;
    }
  }

  const startDateField = (course) => {
    const labelDate = changeFormat(course?.startDate);

    return <td className="text-center align-middle" style={{
      width: '160px'
    }}>
      <Select
        options={course?.coursePricing?.course?.start_dates?.map((start_date) => {
          const labelDate = changeFormat(start_date);
 
          return {
            value: start_date,
            label: labelDate
          }
        })}
        value={{ label: labelDate, value: course?.startDate }}
        onChange={(e) => handleChangeStartDate(e, course.id)}
      />
    </td>
  }

  const endDateField = (course) => {
    let date = "";
    if(course) {
      date = changeFormat(formatDate(findFinishDateCourse(course?.startDate, course?.duration), "yyyy-MM-dd"));
    }

    return (<td className="text-center align-middle" style={{
      width: '110px'
    }}>{date}</td>);
  }

  return (
    <Card>
      <Card.Header><h4>Courses</h4></Card.Header>
      <Table className="mb-0" striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th>Start date</th>
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
              <td className="text-center align-middle" style={{
                wordWrap: 'break-word'
              }}>
                <b>
                  {course?.coursePricing?.course?.name}
                </b>
              </td>
              {
                durationField(course)
              }
              {
                startDateField(course)
              }
              {
                endDateField(course)
              }
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
      {courses?.length > 0 && <AppModal
        title="Remove all the courses"
        content="Are you sure you want to remove all the courses?"
        actionTextButton="Remove All"
        actionVariantButton="danger"
        showTextButton="Remove All"
        showVariantButton="danger"
        onAction={removeAllCourses}
      />}
    </Card>
  );
}

export default Courses;
