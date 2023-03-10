export const createCourseHash =
  (web3: any) => (courseId: any, account: any) => {
    const hexCourseId = web3.utils.utf8ToHex(courseId);
    const courseHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account }
    );

    return courseHash;
  };
