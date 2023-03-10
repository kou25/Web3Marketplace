import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";
import { loadContract } from "@/utils/loadContract";

const Web3Context = createContext<any>(null);

type Props = {
  children: JSX.Element | JSX.Element[];
};

export type Web3Props = {
  web3: any;
  provider: any;
  contract: any;
  isLoading: boolean;
};
const createWeb3State = ({
  web3,
  provider,
  contract,
  isLoading
}: Web3Props) => {
  return {
    web3,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ web3, provider, contract })
  };
};

export default function Web3Provider({ children }: Props) {
  const [web3Api, setWeb3Api] = useState(
    createWeb3State({
      web3: null,
      provider: null,
      contract: null,
      isLoading: true
    })
  );
  useEffect(() => {
    const loadProvider = async () => {
      const provider: any = await detectEthereumProvider();

      if (provider) {
        const web3: any = new Web3(provider);
        const contract = await loadContract("CourseMarketplace", web3);
        setWeb3Api(
          createWeb3State({
            web3,
            provider,
            contract,
            isLoading: false
          })
        );
      } else {
        setWeb3Api((api) => ({ ...api, isLoading: false }));
        console.error("Please install MetaMask!");
      }
    };
    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const { provider, web3, isLoading } = web3Api;
    return {
      ...web3Api,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? async () => {
            try {
              //@ts-ignore
              await provider.request({ method: "eth_requestAccounts" });
            } catch (err) {
              location.reload();
            }
          }
        : () =>
            console.log(
              "Trying to connect to Metamask, try to reload your browser please."
            )
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(cb: any) {
  const { hooks } = useWeb3();
  return cb(hooks);
}
