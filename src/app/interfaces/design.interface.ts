export interface Design {
    id: string;
    stars: boolean;
    title: string;
    year: number;
    platform: string;
    url: string;
    tags: string[];
    description?: string;
    images: DesignImage[];
}

export interface DesignImage {
    url: string;
    alt: string;
    caption?: string;
}