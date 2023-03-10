import { COURSE_PRICE, useEthPrice } from "@/components/hooks/useEthPrice";
import Image from "next/image";
import { Loader } from "@/components/ui/common";

const EthRates = () => {
  const { eth } = useEthPrice();
  return (
    <div className="flex flex-col xs:flex-row text-center">
      <div className="p-6 border drop-shadow rounded-md mr-2 mt-1 sm:mt-8 md:mt-0">
        <div className="flex items-center justify-center">
          {eth.data ? (
            <>
              <Image height="35" width="35" src="/small-eth.webp" alt="eth" />
              <span className="text-xl font-bold">= {eth.data}$</span>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500">Current eth Price</p>
      </div>
      <div className="p-6 border drop-shadow rounded-md mt-5 sm:mt-8  md:mt-0">
        <div className="flex items-center justify-center">
          {eth.data ? (
            <>
              <span className="text-xl font-bold">{eth.perItem}</span>
              <Image height="35" width="35" src="/small-eth.webp" alt="eth" />
              <span className="text-xl font-bold">= {COURSE_PRICE}$</span>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500">Price per course</p>
      </div>
    </div>
  );
};
export default EthRates;
