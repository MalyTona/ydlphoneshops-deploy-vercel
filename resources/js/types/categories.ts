export interface CategoryItemData {
    id: number;
    name: string;
    slug: string;
    image: string;
    color: string;
}

export interface CreateCategoryItemData {
    name: string;
    slug: string;
    color: string;
    image: File | null;
    description: string;
}
