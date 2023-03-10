import { useAccount } from "@/components/hooks/web3";
import { BreadCrumbs } from "@/components/ui/common";
import { EthRates, WalletBar } from "@/components/ui/web3";

export default function Header() {
  const { account } = useAccount();
  const LINKS = [
    {
      href: "/marketplace",
      value: "Buy"
    },
    {
      href: "/marketplace/courses/owned",
      value: "My Courses"
    },
    {
      href: "/marketplace/courses/manage",
      value: "Manage Courses",
      requireAdmin: true
    }
  ];
  return (
    <>
      <div className="pt-4">
        <WalletBar />
      </div>
      <div className="pt-4">
        <EthRates />
      </div>
      <div className="flex flex-row-reverse p-4 sm:px-6 lg:px-8">
        <BreadCrumbs isAdmin={account.isAdmin} items={LINKS} />
      </div>
    </>
  );
}
