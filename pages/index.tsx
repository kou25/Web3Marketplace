import { Hero } from "@/components/ui/common";
import { CourseCard, CourseList } from "@/components/ui/course";
import { BaseLayout } from "@/components/ui/layout";
import { getAllCourses } from "@/content/courses/fetcher";
import { CourseListType } from "@/content/courses/utils";

type Props = {
  courses: CourseListType[];
};
export default function Home({ courses }: Props) {
  return (
    <>
      <BaseLayout>
        <Hero />
        <CourseList courses={courses}>
          {(course: CourseListType) => (
            <CourseCard key={course.id} course={course} disabled={false} />
          )}
        </CourseList>
      </BaseLayout>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data
    }
  };
}
