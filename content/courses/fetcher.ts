import courses from "./index.json";
import { CourseListType } from "./utils";

export const getAllCourses = () => {
  const couseLists: CourseListType[] = courses;
  return {
    data: couseLists,
    courseMap: couseLists.reduce(
      (
        a: Record<string, CourseListType>,
        c: CourseListType,
        i: number
      ): Record<string, CourseListType> => {
        a[c.id] = c;
        a[c.id].index = i;
        return a;
      },
      {}
    )
  };
};
