// export interface DesignItem {
//     imageUrl: string;
//     title: string;
//     year: number | string;
//     sourceName: string;
//     sourceUrl: string;
//     tags: string[];
//     projects: string[];
//     description?: string;
//     altText?: string;
//   }
export interface DesignItem {
  title: string;
  year: number;
  platform: string;
  platformUrl: string;
  tags: string[];
  categories: string[];
  description?: string;
  images: {
    url: string;
    alt?: string;
    description?: string;
  }[];
}