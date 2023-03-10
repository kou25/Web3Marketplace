import { useOwnedCourses, useWalletInfo } from "@/components/hooks/web3";
import { Button, Loader, Message } from "@/components/ui/common";
import { CourseCard, CourseList } from "@/components/ui/course";
import { BaseLayout } from "@/components/ui/layout";
import { getAllCourses } from "@/content/courses/fetcher";
import { CourseListType } from "@/content/courses/utils";
import { OrderModal } from "@/components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@/components/ui/marketplace";
import { useWeb3 } from "@/components/provider";
import { withToast } from "@/utils/toast";
type Props = {
  courses: CourseListType[];
};

export type OrderStates = {
  price: string | number;
  email: string;
  confirmationEmail: string;
};
export default function Marketplace({ courses }: Props) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);
  const [busyCourseId, setBusyCourseId] = useState<any>(null);

  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const purchaseCourse = async (order: OrderStates, course: CourseListType) => {
    const hexCourseId = web3.utils.utf8ToHex(course.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));
    setBusyCourseId(course.id);
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      );

      withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
    }
  };

  const _purchaseCourse = async (
    { hexCourseId, proof, value }: any,
    course: CourseListType
  ) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });

      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: "purchased",
          owner: account.data,
          price: value
        }
      ]);
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const _repurchaseCourse = async (
    { courseHash, value }: any,
    course: CourseListType
  ) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      const index = ownedCourses.data.findIndex(
        (c: CourseListType) => c.id === course.id
      );

      if (index >= 0) {
        ownedCourses.data[index].state = "purchased";
        ownedCourses.mutate(ownedCourses.data);
      } else {
        ownedCourses.mutate();
      }
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
  };

  return (
    <>
      <BaseLayout>
        <div className="pt-4">
          <MarketHeader />
        </div>
        <CourseList courses={courses}>
          {(course: CourseListType) => {
            const owned = ownedCourses.lookup[course.id];
            return (
              <CourseCard
                key={course.id}
                course={course}
                state={owned?.state}
                disabled={!hasConnectedWallet}
                Footer={() => {
                  if (requireInstall) {
                    return (
                      <Button disabled={true} variant="lightBlue">
                        Install
                      </Button>
                    );
                  }

                  if (isConnecting) {
                    return (
                      <Button disabled={true} variant="lightBlue">
                        <Loader size="sm" />
                      </Button>
                    );
                  }

                  if (!ownedCourses.hasInitialResponse) {
                    return (
                      <Button variant="white" disabled={true} size="sm">
                        {hasConnectedWallet ? "Loading State..." : "Connect"}
                      </Button>
                    );
                  }
                  const isBusy = busyCourseId === course.id;
                  if (owned) {
                    return (
                      <>
                        <div className="flex">
                          <Button
                            onClick={() =>
                              alert("You are owner of this course.")
                            }
                            disabled={false}
                            size="sm"
                            variant="white"
                          >
                            Yours &#10004;
                          </Button>
                          {owned.state === "deactivated" && (
                            <div className="ml-1">
                              <Button
                                size="sm"
                                disabled={isBusy}
                                onClick={() => {
                                  setIsNewPurchase(false);
                                  setSelectedCourse(course);
                                }}
                                variant="lightBlue"
                              >
                                {isBusy ? (
                                  <div className="flex">
                                    <Loader size="sm" />
                                    <div className="ml-2">In Progress</div>
                                  </div>
                                ) : (
                                  <div>Fund to Activate</div>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  }

                  return (
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      disabled={!hasConnectedWallet || isBusy}
                      variant="lightBlue"
                    >
                      {isBusy ? (
                        <div className="flex">
                          <Loader size="sm" />
                          <div className="ml-2">In Progress</div>
                        </div>
                      ) : (
                        <div>Purchase</div>
                      )}
                    </Button>
                  );
                }}
              />
            );
          }}
        </CourseList>
        <>
          {selectedCourse !== null && (
            <OrderModal
              course={selectedCourse!}
              isNewPurchase={isNewPurchase}
              onSubmit={(formData: OrderStates, course: CourseListType) => {
                purchaseCourse(formData, course);
                cleanupModal();
              }}
              onClose={cleanupModal}
            />
          )}
        </>
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
