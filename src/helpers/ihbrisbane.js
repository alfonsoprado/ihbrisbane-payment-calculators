import { ucFirst } from "./tools";

export function formatCourse(course) {
  if (course.type === "standard") {
    return course?.name;
  }
  return `${course?.name} [${ucFirst(course?.type)}]`;
}
