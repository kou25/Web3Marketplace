import { CourseListType } from "@/content/courses/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  courses: CourseListType[];
  children: any;
};
export default function List({ courses, children }: Props) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => children(course))}
    </section>
  );
}
