import { Footer, Navbar } from "@/components/ui/common";
import Head from "next/head";

type Props = {
  children: JSX.Element | JSX.Element[];
};
export default function BaseLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Marketplace</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
        <div className="fit">{children}</div>
      </div>
      <Footer />
    </>
  );
}
