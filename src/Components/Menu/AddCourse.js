import { useEffect, useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import Select from 'react-select';
import { changeFormat, findFinishDateCourse, formatDate } from "../../helpers/dates";
import { scrollTo } from "../../helpers/tools";

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
  // use one time
  const [scrollToPaymentOptions, setScrollToPaymentOptions] = useState(true);

  useEffect(() => {
    setCoursePricing("");
    setStartDate("");
    setDuration("");
  }, [courses]);

  const handleChangeDuration = (e) => {
    const { value } = e.target;
    setDuration(value);
  };

  const handleChangeCoursePricing = (e) => {
    const value = e.value;
    setCoursePricing({ label: value?.course?.name, value });
    setStartDate("");
    let duration_weeks = "";
    if (value?.course?.duration_weeks) {
      duration_weeks = value?.course?.duration_weeks;
    } else if (!value?.course?.duration_weeks && value?.course?.minimum_duration_weeks) {
      duration_weeks = value?.course?.minimum_duration_weeks;
    }

    setDuration(duration_weeks);
  };

  const handleChangeStartDate = (e) => {
    const value = e.value;
    if(coursePricing?.value?.course?.start_dates_with_weeks?.length > 0) {
      setDuration(coursePricing?.value?.course?.start_dates_with_weeks?.find(obj => obj.start_date === value)?.duration_weeks);
    }
    setStartDate({ label: value, value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = {
      coursePricing: coursePricing?.value,
      startDate: startDate?.value,
      duration: duration,
      finishDate: formatDate(findFinishDateCourse(startDate?.value, duration), "yyyy-MM-dd")
    };
    createCourse(form);
    // Clean values
    setCoursePricing("");
    setStartDate("");
    setDuration("");
    // scroll to payment_options
    if (scrollToPaymentOptions) {
      scrollTo("payment_options");
      setScrollToPaymentOptions(false);
    }
  };

  const coursesCategory = () => {
    return data?.categories?.map((category) => {
      return {
        options: coursesOption(data, category, courses).map(coursePricing => {
          return {
            value: coursePricing,
            label: coursePricing?.course?.name
          }
        }), label: category?.name
      };
    });
  }

  const coursesOption = (data, category) => {
    if (data?.payment_calculator?.type === "elicos") {
      const coursesWithMultipleDates = JSON.parse(data?.payment_calculator?.parameters)?.courses_with_multiple_dates;
      return data?.course_pricings?.filter(coursePricing => coursePricing?.course?.category?.id === category?.id && (!courses.find((item) => item?.coursePricing?.course?.name === coursePricing?.course?.name) || coursesWithMultipleDates.includes(coursePricing?.course?.cricos_code)));
    } else if (data?.payment_calculator?.type === "aged_care") {
      const courseOrderSelection = JSON.parse(data?.payment_calculator?.parameters)?.course_order_selection_list;
      const coursePricings = courses?.some(course => courseOrderSelection.includes(course.coursePricing?.course?.course_code)) ?
        data?.course_pricings :
        data?.course_pricings?.filter(coursePricing => courseOrderSelection.includes(coursePricing?.course?.course_code));
      return coursePricings.filter(coursePricing => coursePricing?.course?.category?.id === category?.id && !courses.find((item) => item?.coursePricing?.course?.name === coursePricing?.course?.name));
    } else if (data?.payment_calculator?.type === "als_college") { 
      const courseOrderSelection = JSON.parse(data?.payment_calculator?.parameters)?.course_order_selection_list;
      let coursePricings = data?.course_pricings?.filter(coursePricing => courseOrderSelection.includes(coursePricing?.course?.course_code));
      if(courses?.some(course => ["CHC33021", "CHC43015"].includes(course.coursePricing?.course?.course_code))) {
        coursePricings = data?.course_pricings.filter(coursePricing => !["RII60520", "AHC40422"].includes(coursePricing?.course?.course_code));
      } else if(courses?.some(course => ["AHC40422"].includes(course.coursePricing?.course?.course_code))) {
        coursePricings = data?.course_pricings.filter(coursePricing => !["CHC33021", "CHC43015", "RII60520"].includes(coursePricing?.course?.course_code));
      } else if (courses?.some(course => ["RII60520"].includes(course.coursePricing?.course?.course_code))) {
        coursePricings = [];
      }
      coursePricings = coursePricings.filter(coursePricing => coursePricing?.course?.category?.id === category?.id && !courses.find((item) => item?.coursePricing?.course?.name === coursePricing?.course?.name));
      return coursePricings;
    } else {
      return data?.course_pricings?.filter(coursePricing => coursePricing?.course?.category?.id === category?.id && !courses.find((item) => item?.coursePricing?.course?.cricos_code === coursePricing?.course?.cricos_code));
    }
  }

  const durationField = () => {
    if (!coursePricing?.value || coursePricing?.value?.course?.duration_weeks || coursePricing?.value?.course?.start_dates_with_weeks?.length > 0) {
      return <Form.Group className="mb-2">
        <Form.Label className="me-2"><b>Duration weeks:</b></Form.Label>
        {duration}
      </Form.Group>
    } else {
      return <Form.Group className="mb-2">
        <Form.Label><b>Duration weeks:</b></Form.Label>
        <Form.Control
          name="duration"
          onChange={handleChangeDuration}
          required
          value={duration}
          type="number"
          min={coursePricing?.value?.course?.minimum_duration_weeks || 1}
          step="1"
          placeholder="Number of weeks"
        ></Form.Control>
      </Form.Group>
    }
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        <h4>Add Course</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label><b>Course:</b></Form.Label>
            <Select
              formatGroupLabel={formatGroupLabel}
              options={coursesCategory()}
              value={coursePricing}
              onChange={handleChangeCoursePricing} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label><b>Start date:</b></Form.Label>
            <Select
              options={coursePricing?.value?.course?.start_dates?.map((start_date) => {
                return {
                  value: start_date,
                  label: changeFormat(start_date)
                }
              })}
              value={startDate }
              onChange={handleChangeStartDate} />
          </Form.Group>
          {
            durationField()
          }
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
