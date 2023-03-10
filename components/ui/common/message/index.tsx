import { useState } from "react";

const TYPES: any = {
  success: "green",
  warning: "yellow",
  danger: "red"
};

const BG_TYPES: any = {
  success: "bg-green-100",
  warning: "bg-yellow-100",
  danger: "bg-red-100"
};

const TEXT_TYPES: any = {
  success: "text-green-900",
  warning: "text-yellow-900",
  danger: "text-red-900"
};

const SIZES: any = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg"
};

export default function Message({
  children,
  type = "success",
  size = "md"
}: {
  children: any;
  type?: string;
  size?: any;
}) {
  const [isDisplayed, setIsDisplayed] = useState(true);

  if (!isDisplayed) {
    return null;
  }

  const messageSizeClass = SIZES[size];

  return (
    <div className={`${BG_TYPES[type]} rounded-xl mb-3`}>
      <div className="max-w-7xl mx-auto py-2 px-1">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <div
              className={`ml-3 ${messageSizeClass} font-medium ${TEXT_TYPES[type]}`}
            >
              <span className="inline">{children}</span>
            </div>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              onClick={() => setIsDisplayed(false)}
              type="button"
              className="-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className={`h-6 w-6 ${TEXT_TYPES[type]}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
