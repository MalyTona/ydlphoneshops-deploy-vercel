// import CategoriesDataTable from '@/components/dashboard/CategoriesDataTable';
import CategoriesDataTable from '@/components/dashboard/CategoriesDataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
// import { CategoryItem } from '@/types/categories';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/dashboard/categories',
    },
];

export default function Categories() {
    // console.log(categories);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CategoriesDataTable />
            </div>
        </AppLayout>
    );
}
