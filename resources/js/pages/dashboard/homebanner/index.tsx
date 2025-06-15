// File: resources/js/pages/dashboard/homebanner/index.tsx

import HomeBannerDataTable from '@/components/dashboard/HomeBannerDataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { BannerItem } from '@/types/banners'; // <-- Import the new banner type
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home Banners',
        href: route('dashboard.homebanner.index'),
    },
];

// The page now receives 'banners' as a prop from the controller
export default function HomeBannerPage({ banners }: { banners: BannerItem[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home Banners" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Pass the banners data down to the data table */}
                <HomeBannerDataTable banners={banners} />
            </div>
        </AppLayout>
    );
}
