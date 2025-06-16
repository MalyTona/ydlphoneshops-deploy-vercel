('use client');

import { CategoryItem, CreateCategoryItem } from '@/types/categories';
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, FileDown, Pencil, Plus, RefreshCw, Search, Trash } from 'lucide-react';
import * as React from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Link, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// import { CategoryItem, CreateCategoryItem } from '@/types/categories';
import { CompactFileInput } from '../FormInputs/ImageUpload';
import InputError from '../input-error';
import { Textarea } from '../ui/textarea';

// ... (your existing Product type and columns definition remain the same)
export const columns: ColumnDef<CategoryItem>[] = [
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => {
            const imagePath = row.original.image.startsWith('categories/') ? `/storage/${row.original.image}` : row.original.image;
            return (
                <div className="flex items-center justify-center">
                    <img src={imagePath} alt={row.getValue('name')} width={40} height={40} className="rounded-md object-cover" />
                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },

    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/${id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            );
        },
    },
];

export default function CategoriesDataTable({ categories }: { categories: CategoryItem[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const table = useReactTable({
        data: categories,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: rowsPerPage,
            },
        },
    });

    React.useEffect(() => {
        table.setPageSize(rowsPerPage);
    }, [rowsPerPage, table]);

    const handleExportToExcel = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const rowData = row.original;
            return {
                ID: rowData.id,
                Name: rowData.name,
                Slug: rowData.slug,
                Image: rowData.image,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
    };

    const [images, setImages] = React.useState<File[]>([]);
    const { data, setData, processing, errors, reset } = useForm<Required<CreateCategoryItem>>({
        name: '',
        slug: '',
        color: '',
        image: null,
        description: '',
    });

    // --- Start of changes ---

    // 1. Add state for client-side validation errors
    const [clientErrors, setClientErrors] = React.useState({
        name: '',
        color: '',
        image: '',
        description: '',
    });

    // 2. Create a validation function
    const validate = () => {
        const newErrors = {
            name: '',
            color: '',
            image: '',
            description: '',
        };

        let isValid = true;

        if (!data.name) {
            newErrors.name = 'The category name is required.';
            isValid = false;
        }
        if (!data.color) {
            newErrors.color = 'The color class is required.';
            isValid = false;
        }
        if (images.length === 0) {
            newErrors.image = 'An image is required.';
            isValid = false;
        }
        if (!data.description) {
            newErrors.description = 'The description is required.';
            isValid = false;
        }

        setClientErrors(newErrors);
        return isValid;
    };

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        // 3. Run validation before submitting
        if (!validate()) {
            return; // Stop submission if validation fails
        }

        // Clear client errors if validation passes
        setClientErrors({ name: '', color: '', image: '', description: '' });

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('color', data.color);
        formData.append('description', data.description || '');
        if (images[0]) {
            formData.append('image', images[0]);
        }

        router.post('/dashboard/categories', formData, {
            onSuccess: () => {
                reset();
                setImages([]);
                setShowAddDialog(false);
                toast.success('Category created successfully!');
            },
            onError: (serverErrors) => {
                toast.error('Failed to create category. Please check the errors.');
                // Server errors will be automatically handled by the `errors` prop from useForm
            },
        });
    };

    // --- End of changes ---

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                        <p className="text-muted-foreground text-sm">Manage your shop Categories</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[750px]">
                                <form action="" onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Category</DialogTitle>
                                        <DialogDescription>Fill in the details to add a new category to your inventory.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Category Name</Label>
                                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                {/* 4. Display client or server error */}
                                                <InputError message={errors.name || clientErrors.name} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category Tailwind Color Class eg bg-slate-100</Label>
                                                <Input id="category" value={data.color} onChange={(e) => setData('color', e.target.value)} />
                                                {/* 4. Display client or server error */}
                                                <InputError message={errors.color || clientErrors.color} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="message">Category Description</Label>
                                            <Textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Type your message here."
                                                id="message"
                                            />
                                            {/* 4. Display client or server error */}
                                            <InputError message={errors.description || clientErrors.description} className="mt-2" />
                                        </div>
                                        <div className="mb-8">
                                            <h2 className="mb-3 text-lg font-semibold">Upload Category Image</h2>
                                            <div className="rounded border p-4">
                                                <CompactFileInput multiple={false} maxSizeMB={1} onChange={setImages} />
                                                {/* 4. Display client or server error */}
                                                <InputError message={errors.image || clientErrors.image} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button disabled={processing} type="submit">
                                            {processing ? 'Creating...' : 'Add Category'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* ... (rest of your component remains the same) ... */}
                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            placeholder="Search..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="all-time">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-time">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleExportToExcel} className="flex items-center gap-1">
                            <FileDown className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
                <div className="rounded-md">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
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
            <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Rows per page:</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="5" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-sm">
                        Showing {table.getState().pagination.pageIndex * rowsPerPage + 1}-
                        {Math.min((table.getState().pagination.pageIndex + 1) * rowsPerPage, table.getFilteredRowModel().rows.length)} of{' '}
                        {table.getFilteredRowModel().rows.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    {Array.from({ length: table.getPageCount() }).map((_, index) => (
                        <Button
                            key={index}
                            variant={table.getState().pagination.pageIndex === index ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => table.setPageIndex(index)}
                            className="h-8 w-8 p-0"
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </CardFooter>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete {table.getFilteredSelectedRowModel().rows.length} selected product(s). This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
