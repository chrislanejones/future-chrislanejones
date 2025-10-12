export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags?: string[];
  coverImage?: string;
  readingTime?: string;
  content?: string;
};
