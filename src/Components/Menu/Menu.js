import AddCourse from "./AddCourse";
import PaymentOptions from "./PaymentOptions";

function Menu({
  data,
  createCourse,
  errorMessages,
  createPaymentPlan,
  courses,
  showPaymentPlanTable,
  cleanPaymentPlan,
  showApplicationForm
}) {
  return (
    <>
      <AddCourse
        data={data}
        createCourse={createCourse}
        courses={courses} />
      {
        courses.length > 0 && <PaymentOptions
          data={data}
          errorMessages={errorMessages}
          cleanPaymentPlan={cleanPaymentPlan}
          showPaymentPlanTable={showPaymentPlanTable}
          showApplicationForm={showApplicationForm}
          createPaymentPlan={createPaymentPlan}
          courses={courses} />
      }

    </>
  );
}

export default Menu;
