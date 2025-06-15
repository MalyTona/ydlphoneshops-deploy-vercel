export type BannerItem = {
    id: number;
    title: string;
    description: string | null;
    link: string | null;
    image: string;
    status: 'active' | 'inactive';
};
