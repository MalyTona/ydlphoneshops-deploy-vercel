import ProductListing from '@/components/frontend/ProductListing';
import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { CategoryItem } from '@/types/categories';

export default function home({ categories }: { categories: CategoryItem[] }) {
    return (
        <ShopFrontLayout>
            <div className="min-h-screen">
                <div className="container mx-auto max-w-6xl">
                    <ShopBanner />
                </div>
                <div className="mt-8 mb-4">
                    <ShopCategories categories={categories} />
                </div>
                <div className="mt-8 mb-4">
                    <ProductListing />
                </div>
            </div>
        </ShopFrontLayout>
    );
}
