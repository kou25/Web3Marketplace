export interface CourseListType {
  id: string | number;
  type: string;
  title: string;
  description: string;
  coverImage: string;
  author: string;
  link: string;
  slug: string;
  wsl: string[];
  createdAt: Date | string;
  index?: number;
}
