/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useSWR from "swr";

const adminAddr: any = {
  "0x8602b157e2424b89b7460befd369787ce5732378f230d1b8001cb46275e555ca": true,
  "0x96fb5a4ae61252afea4d734a4612743e20a04b9a0672d6cdf9ff310baf8be443": true
};

export const handler = (web3: any, provider: any) => () => {
  const { mutate, data, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retreive an account. Please refresh the browser."
        );
      }
      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts: any) => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddr[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest
  };
};
