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