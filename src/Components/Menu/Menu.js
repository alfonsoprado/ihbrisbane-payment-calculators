import AddCourse from "./AddCourse";
import Options from "./Options";

function Menu({ data, createCourse, errorMessages, createPaymentPlan, courses }) {
  return (
    <>
      <AddCourse 
        data={data} 
        createCourse={createCourse} 
        courses={courses} />
      {
        courses.length > 0 && <Options
        data={data}
        errorMessages={errorMessages}
        createPaymentPlan={createPaymentPlan}
        courses={courses} />
      }
      
    </>
  );
}

export default Menu;
