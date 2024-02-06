import { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
);

function AddCourse({ data, createCourse, courses }) {
  const [coursePricing, setCoursePricing] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");

  const handleChangeCoursePricing = (e) => {
    const value = e.value;
    setCoursePricing({ label: value?.course?.name, value});
    setStartDate("");
    setDuration(value?.course?.duration_weeks || "");
  };

  const handleChangeStartDate = (e) => {
    const value = e.value;
    setStartDate({ label: value, value});
  }

  const handleChangeDuration = (e) => {
    const { value } = e.target;
    setDuration(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = {
      coursePricing: coursePricing?.value,
      startDate: startDate?.value,
      duration
    };
    createCourse(form);
    // Clean values
    setCoursePricing("");
    setStartDate("");
    setDuration("")
    console.log("AddCourse", form);
  };

  return (
    <Card className="mb-3">
      <Card.Header>
        <h4>Add course</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Course:</Form.Label>
            <Select 
              formatGroupLabel={formatGroupLabel}
              options={data?.categories?.map((category) => {
                return { options: data?.course_pricings?.filter(coursePricing => coursePricing?.course?.category?.id === category?.id && !courses.find((item) => item?.coursePricing?.course?.cricos_code === coursePricing?.course?.cricos_code)).map(coursePricing => {
                  return {
                    value: coursePricing,
                    label: coursePricing?.course?.name
                  }
                }), label: category?.name };
              })}
              value={coursePricing}
              onChange={handleChangeCoursePricing} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start date:</Form.Label>
            <Select 
              options={coursePricing?.value?.course?.start_dates?.map((start_date) => {
                return {
                  value: start_date,
                  label: start_date
                }
              })}
              value={startDate}
              onChange={handleChangeStartDate} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Duration:</Form.Label>
            <Form.Control
              name="duration"
              required
              onChange={handleChangeDuration}
              value={duration}
              type="number"
              min="1"
              step="1"
              placeholder="Number of weeks"
            ></Form.Control>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button 
                disabled={
                  !coursePricing ||
                  !startDate ||
                  !duration
                }
              className="mt-2" variant="dark" type="submit">
              Add Course
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddCourse;
