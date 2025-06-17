export type BannerItem = {
    id: number;
    image_url: string;
    link_url: string | null;
    alt: string;
    is_active: boolean; // Changed from 'status'
    sort_order: number | null;
};
