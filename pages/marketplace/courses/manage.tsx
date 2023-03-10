import { useAccount, useManagedCourses } from "@/components/hooks/web3";
import { Button, Message } from "@/components/ui/common";
import { CourseFilter } from "@/components/ui/course";
import ManagedCourseCard from "@/components/ui/course/card/Managed";
import { BaseLayout } from "@/components/ui/layout";
import { MarketHeader } from "@/components/ui/marketplace";
import { useEffect, useState } from "react";
import { useWeb3 } from "@/components/provider";
import { normalizeOwnedCourse } from "@/utils/normalize";
import { CourseListType } from "@/content/courses/utils";
import { withToast } from "@/utils/toast";

const VerificationInput = ({
  onVerify
}: {
  onVerify: (email: string) => void;
}) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-blue-500 shadow-md focus:border-blue-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md mr-2"
        placeholder="0x2341ab..."
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};

export default function ManageCourses() {
  const { account } = useAccount();
  const [proofedOwnership, setProofedOwnership] = useState<any>({});
  const { web3, contract } = useWeb3();
  const { managedCourses } = useManagedCourses(account);
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [filters, setFilters] = useState({ state: "all" });

  const searchCourse = async (hash: any) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (hash && hash.length === 66 && re.test(hash)) {
      const course = await contract.methods.getCourseByHash(hash).call();

      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)({ hash }, course);
        setSearchedCourse(normalized);
        return;
      }
    }

    setSearchedCourse(null);
  };

  const changeCourseState = async (courseHash: any, method: any) => {
    try {
      const result = await contract.methods[method](courseHash).send({
        from: account.data
      });
      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const activateCourse = async (courseHash: any) => {
    withToast(changeCourseState(courseHash, "activateCourse"));
  };

  const deactivateCourse = async (courseHash: any) => {
    withToast(changeCourseState(courseHash, "deactivateCourse"));
  };
  const verifyCourse = (email: any, { hash, proof }: any) => {
    if (!email) {
      return;
    }
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership({
          [hash]: true
        })
      : setProofedOwnership({
          [hash]: false
        });
  };

  const renderCard = (course: any, isSearched?: any) => {
    return (
      <ManagedCourseCard
        key={course.ownedCourseId}
        isSearched={isSearched}
        course={course}
      >
        <VerificationInput
          onVerify={(email) => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof
            });
          }}
        />
        {proofedOwnership[course.hash] && (
          <div className="mt-2">
            <Message>Verified!</Message>
          </div>
        )}
        {proofedOwnership[course.hash] === false && (
          <div className="mt-2">
            <Message type="danger">Wrong Proof!</Message>
          </div>
        )}
        {course.state === "purchased" && (
          <div className="mt-2">
            <Button onClick={() => activateCourse(course.hash)} variant="green">
              Activate
            </Button>
            <Button onClick={() => deactivateCourse(course.hash)} variant="red">
              Deactivate
            </Button>
          </div>
        )}
      </ManagedCourseCard>
    );
  };
  const filteredCourses = managedCourses.data
    ?.filter((course: any) => {
      if (filters.state === "all") {
        return true;
      }

      return course.state === filters.state;
    })
    .map((course: any) => renderCard(course));
  if (!account.isAdmin) {
    return null;
  }
  return (
    <BaseLayout>
      <MarketHeader />
      <CourseFilter
        onSearchSubmit={searchCourse}
        onFilterSelect={(value: any) => setFilters({ state: value })}
      />
      <section className="grid grid-cols-1">
        {searchedCourse && (
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            {renderCard(searchedCourse, true)}
          </div>
        )}
        <h1 className="text-2xl font-bold p-5">All Courses</h1>
        {filteredCourses}
        {filteredCourses?.length === 0 && (
          <Message type="warning">No courses to display</Message>
        )}
      </section>
    </BaseLayout>
  );
}
