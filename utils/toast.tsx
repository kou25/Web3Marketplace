import { toast } from "react-toastify";

export const withToast = (promise: any) => {
  toast.promise(
    promise,
    {
      pending: {
        render() {
          return (
            <div className="p-6 py-2">
              <p className="mb-2">Your transaction is being processed.</p>
              <p>Hang tight... Just few more moments.</p>
            </div>
          );
        },
        icon: false
      },
      success: {
        render({ data }: any) {
          return (
            <div>
              <p className="font-bold">
                Tx: {data.transactionHash.slice(0, 20)}...
              </p>
              <p>Has been succesfuly processed.</p>
              <a
                href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}
                target="_blank"
              >
                <i className="text-blue-500 underline">See Tx Details</i>
              </a>
            </div>
          );
        },
        // other options
        icon: "🟢"
      },
      error: {
        render({ data }: any) {
          // When the promise reject, data will contains the error
          return <div>{data.message ?? "Transaction has failed"}</div>;
        }
      }
    },
    {
      closeButton: true
    }
  );
};
