import AddCourse from "./AddCourse";
import PaymentOptions from "./PaymentOptions";

function Menu({
  data,
  createCourse,
  errorMessages,
  createPaymentPlan,
  courses,
  paymentPlan,
  showPaymentPlanTable,
  cleanPaymentPlan
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
          createPaymentPlan={createPaymentPlan}
          paymentPlan={paymentPlan}
          courses={courses} />
      }

    </>
  );
}

export default Menu;
