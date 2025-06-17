// File: resources/js/components/dashboard/HomeBannerDataTable.tsx

'use client';

// --- All your imports are correct, just make sure these are present ---
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BannerItem } from '@/types/banners';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plus, RefreshCw, Trash } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { CompactFileInput } from '../FormInputs/ImageUpload';
import InputError from '../input-error';
import { Textarea } from '../ui/textarea';

// Your column definitions can remain the same
export const columns: ColumnDef<BannerItem>[] = [
    {
        accessorKey: 'image_url',
        header: 'Image',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <img
                    src={`/storage/${row.getValue('image_url')}`}
                    alt={row.original.title}
                    width={80}
                    height={40}
                    className="rounded-md object-cover"
                />
            </div>
        ),
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const banner = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`#`}>
                            {' '}
                            {/* Placeholder for edit */}
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];

export default function HomeBannerDataTable({ banners }: { banners: BannerItem[] }) {
    const [showAddDialog, setShowAddDialog] = React.useState(false);

    const table = useReactTable({
        data: banners,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // ... add other table config if needed
    });

    // This form setup is now correct for a file upload
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        link: '',
        status: 'active' as 'active' | 'inactive',
        image_url: null as File | null,
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
                        <p className="text-muted-foreground text-sm">{banners.length} Mange your Shop Banner</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => router.reload()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[750px]">
                                <form onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Home Banner</DialogTitle>
                                        <DialogDescription>Fill in the details to add a new home banner.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Banner Title</Label>
                                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                            <InputError message={errors.title} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                            />
                                            <InputError message={errors.description} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="link">Link</Label>
                                            <Input id="link" value={data.link} onChange={(e) => setData('link', e.target.value)} />
                                            <InputError message={errors.link} />
                                        </div>

                                        {/* --- THIS IS THE FIX --- */}
                                        {/* We replaced the text input with the file upload component */}
                                        <div className="space-y-2">
                                            <Label>Image</Label>
                                            <CompactFileInput
                                                onChange={(files) => setData('image_url', files[0] || null)}
                                                acceptedFileTypes="image/*"
                                            />
                                            <InputError message={errors.image_url} />
                                        </div>
                                        {/* --- END OF FIX --- */}

                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.status} />
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
            <CardContent>{/* The rest of the table rendering goes here... */}</CardContent>
        </Card>
    );
}
