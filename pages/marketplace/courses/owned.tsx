import { useAccount, useOwnedCourses } from "@/components/hooks/web3";
import { Button, Message } from "@/components/ui/common";
import { OwnedCourseCard } from "@/components/ui/course";
import { BaseLayout } from "@/components/ui/layout";
import { MarketHeader } from "@/components/ui/marketplace";
import { getAllCourses } from "@/content/courses/fetcher";
import { CourseListType } from "../../../content/courses/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWeb3 } from "@/components/provider";

export default function OwnedCourses({ courses }: { courses: CourseListType }) {
  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const data = JSON.stringify(ownedCourses.data);
  const router = useRouter();
  const { requireInstall } = useWeb3();
  return (
    <BaseLayout>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.isEmpty && (
          <div className="w-1/2">
            <Message type="warning">
              <div>{`You don't own any courses`}</div>
              <Link href="/marketplace">
                <span className="font-normal hover:underline">
                  <i>Purchase Course</i>
                </span>
              </Link>
            </Message>
          </div>
        )}
        {account.isEmpty && (
          <div className="w-1/2">
            <Message type="warning">
              <div>Please connect to Metamask</div>
            </Message>
          </div>
        )}
        {requireInstall && (
          <div className="w-1/2">
            <Message type="warning">
              <div>Please install Metamask</div>
            </Message>
          </div>
        )}
        {ownedCourses.data?.map((course: any) => (
          <OwnedCourseCard key={course.id} course={course}>
            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the course
            </Button>
          </OwnedCourseCard>
        ))}
      </section>
    </BaseLayout>
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
