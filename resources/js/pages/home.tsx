import ProductListing from '@/components/frontend/ProductListing';
import ShopBanner from '@/components/frontend/ShopBanner';
import ShopCategories from '@/components/frontend/ShopCategories';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { BannerItem } from '@/types/banners';
import { CategoryItem } from '@/types/categories';
export default function Home({
    banners,
    categories,
    // products,
}: {
    banners: BannerItem[];
    categories: CategoryItem[];
}) {
    return (
        <ShopFrontLayout>
            <div className="min-h-screen">
                <div className="container mx-auto max-w-6xl">
                    <ShopBanner banners={banners} />
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
