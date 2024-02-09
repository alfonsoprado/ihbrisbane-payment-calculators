import AddCourse from "./AddCourse";
import PaymentOptions from "./PaymentOptions";

function Menu({ data, createCourse, errorMessages, createPaymentPlan, courses }) {
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
        createPaymentPlan={createPaymentPlan}
        courses={courses} />
      }
      
    </>
  );
}

export default Menu;
