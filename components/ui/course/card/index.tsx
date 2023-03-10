import { CourseListType } from "@/content/courses/utils";
import Image from "next/image";
import Link from "next/link";
import { AnimateKeyframes } from "react-simple-animate";

type Props = {
  course: CourseListType;
  Footer?: () => JSX.Element;
  disabled: boolean;
  state?: string;
};
export default function Card({ course, Footer, disabled, state }: Props) {
  return (
    <div
      key={course.id}
      className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
    >
      <div className="flex h-full w-full">
        <div className="flex-1 h-full w-1/3 relative overflow-hidden next-image-wrapper">
          <Image
            className={`object-cover ${disabled && "filter grayscale"}`}
            fill={true}
            src={course.coverImage}
            alt={course.title}
          />
        </div>
        <div className="p-8 w-2/3 pb-4 flex-2">
          <div className="flex items-center">
            <div className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
              {course.type}
            </div>
            <div>
              {state === "activated" && (
                <div className="text-xs text-black bg-green-200 p-1 px-3 rounded-full">
                  Activated
                </div>
              )}
              {state === "deactivated" && (
                <div className="text-xs text-black bg-red-200 p-1 px-3 rounded-full">
                  Deactivated
                </div>
              )}
              {state === "purchased" && (
                <AnimateKeyframes
                  play
                  duration={2}
                  keyframes={["opacity: 0.2", "opacity: 1"]}
                  iterationCount="infinite"
                >
                  <div className="text-xs text-black bg-yellow-200 p-1 px-3 rounded-full">
                    Pending
                  </div>
                </AnimateKeyframes>
              )}
            </div>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="h-12 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline"
          >
            {course.title}
          </Link>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            {course.description.substring(0, 70)}...
          </p>
          {Footer && (
            <div className="mt-2">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
