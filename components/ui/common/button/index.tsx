type Props = {
  children: any;
  className?: string;
  variant?: string;
  hoverable?: boolean;
  [x: string]: any;
};
export default function Button({
  children,
  className,
  variant = "blue",
  hoverable = true,
  ...rest
}: Props) {
  const variants: any = {
    white: `text-black bg-white`,
    green: `text-white bg-green-600 ${hoverable && "hover:bg-green-700"}`,
    blue: `text-white bg-blue-500 ${hoverable && "hover:bg-blue-700"}`,
    lightBlue: `text-blue-700 bg-blue-100 ${hoverable && "hover:bg-blue-200"}`,
    red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`
  };
  return (
    <button
      {...rest}
      className={`disabled:opacity-50 disabled:cursor-not-allowed xs:px-8 xs:py-3 p-2 mr-2
      border rounded-md text-base font-medium ${className} ${variants[variant]} shadow`}
    >
      {children}
    </button>
  );
}
