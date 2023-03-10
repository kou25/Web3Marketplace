import { Message, Modal } from "@/components/ui/common";

import { BaseLayout } from "@/components/ui/layout";
import { getAllCourses } from "../../content/courses/fetcher";
import { CourseListType } from "@/content/courses/utils";
import { CourseHero, Curriculum, KeyPoints } from "@/components/ui/course";
import { useAccount, useOwnedCourse } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/provider";

type Props = {
  course: CourseListType;
};
export default function Course({ course }: Props) {
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;
  const { isLoading } = useWeb3();
  const isLocked =
    !courseState ||
    courseState === "purchased" ||
    courseState === "deactivated";

  return (
    <BaseLayout>
      <div className="py-4">
        <CourseHero
          hasOwner={!!ownedCourse.data}
          title={course.title}
          description={course.description}
          image={course.coverImage}
        />
      </div>
      <KeyPoints points={course.wsl} />
      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === "purchased" && (
            <Message type="warning">
              Course is purchased and waiting for the activation. Process can
              take up to 24 hours.
              <i className="block font-normal">
                In case of any questions, please contact info@koustav.com
              </i>
            </Message>
          )}
          {courseState === "activated" && (
            <Message type="success">
              MarketPlace wishes you happy watching of the course.
            </Message>
          )}
          {courseState === "deactivated" && (
            <Message type="danger">
              Course has been deactivated, due the incorrect purchase data. The
              functionality to watch the course has been temporaly disabled.
              <i className="block font-normal">
                Please contact info@koustav.com
              </i>
            </Message>
          )}
        </div>
      )}
      <Curriculum
        isLoading={isLoading}
        locked={isLocked}
        courseState={courseState}
      />
      <Modal />
    </BaseLayout>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();
  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug
      }
    })),
    fallback: false
  };
}

export function getStaticProps({ params }: any) {
  const { data } = getAllCourses();
  const course = data.find((c) => c.slug === params.slug);
  return {
    props: {
      course: course
    }
  };
}
