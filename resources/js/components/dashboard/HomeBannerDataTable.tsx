'use client';

import { BannerItem } from '@/types/banners';
import { Link, router, useForm } from '@inertiajs/react'; // Ensure 'router' is imported
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plus, RefreshCw, Trash } from 'lucide-react'; // Remove CheckCircle2 and XCircle if no longer used elsewhere
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Ensure Switch is imported
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CompactFileInput } from '../FormInputs/ImageUpload';
import InputError from '../input-error';

// --- UPDATE: The `is_active` column definition ---
export const columns: ColumnDef<BannerItem>[] = [
    {
        accessorKey: 'image_url',
        header: 'Image',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <img src={`/storage/${row.original.image_url}`} alt={row.original.alt} width={120} className="rounded-md" />
            </div>
        ),
    },
    {
        accessorKey: 'alt',
        header: 'Alt Text',
    },
    {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => {
            const banner = row.original;

            const handleToggle = (checked: boolean) => {
                router.patch(
                    route('dashboard.homebanner.toggle', banner.id),
                    {},
                    {
                        preserveScroll: true, // Prevents page from jumping to top
                        onSuccess: () => toast.success('Banner status updated.'),
                        onError: () => toast.error('Failed to update status.'),
                    },
                );
            };

            return <Switch checked={banner.is_active} onCheckedChange={handleToggle} aria-label="Toggle banner status" />;
        },
    },
    {
        accessorKey: 'link_url',
        header: 'Link URL',
        cell: ({ row }) =>
            row.original.link_url ? (
                <a href={row.original.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {row.original.link_url}
                </a>
            ) : (
                'N/A'
            ),
    },
    {
        accessorKey: 'sort_order',
        header: 'Sort Order',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                    <Link href={`#`}>
                        <Pencil className="h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

// The rest of your component remains the same.
export default function HomeBannerDataTable({ banners }: { banners: BannerItem[] }) {
    // ... all of your existing code for the component ...
    const [showAddDialog, setShowAddDialog] = React.useState(false);

    const table = useReactTable({
        data: banners,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        alt: '',
        link_url: '',
        is_active: true as boolean,
        sort_order: 0,
        image: null as File | null,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard.homebanner.store'), {
            onSuccess: () => {
                reset();
                setShowAddDialog(false);
                toast.success('Banner created successfully!');
            },
            onError: (errs) => {
                console.error(errs);
                toast.error('Failed to create banner. Please check the form.');
            },
        });
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Home Banners</h2>
                        <p className="text-muted-foreground text-sm">Manage your shop banners.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => router.reload()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
                                    <Plus className="mr-2 h-4 w-4" /> Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <form onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Banner</DialogTitle>
                                        <DialogDescription>Fill in the details for the new banner.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="space-y-2">
                                            <Label>Banner Image</Label>
                                            <CompactFileInput onChange={(files) => setData('image', files[0] || null)} acceptedFileTypes="image/*" />
                                            <InputError message={errors.image} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="alt">Alt Text</Label>
                                            <Input
                                                id="alt"
                                                value={data.alt}
                                                onChange={(e) => setData('alt', e.target.value)}
                                                placeholder="e.g., iPhone 15 Pro promotion"
                                            />
                                            <InputError message={errors.alt} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="link_url">Link URL (Optional)</Label>
                                            <Input
                                                id="link_url"
                                                value={data.link_url}
                                                onChange={(e) => setData('link_url', e.target.value)}
                                                placeholder="e.g., /products/iphone-15"
                                            />
                                            <InputError message={errors.link_url} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sort_order">Sort Order</Label>
                                            <Input
                                                id="sort_order"
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value, 10) || 0)}
                                            />
                                            <InputError message={errors.sort_order} />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                            />
                                            <Label htmlFor="is_active">Active</Label>
                                            <InputError message={errors.is_active} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Adding...' : 'Add Banner'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
