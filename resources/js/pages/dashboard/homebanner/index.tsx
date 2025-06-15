import HomeBannerDataTable from '@/components/dashboard/HomeBannerDataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banners',
        href: '/dashboard/homebanner',
    },
];

export default function Banners() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banners" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <HomeBannerDataTable />
            </div>
        </AppLayout>
    );
}
