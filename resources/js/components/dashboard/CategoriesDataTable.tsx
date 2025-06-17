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

import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// import { CategoryItem, CreateCategoryItem } from '@/types/categories';
import { CompactFileInput } from '../FormInputs/ImageUpload';
import InputError from '../input-error';
import { Textarea } from '../ui/textarea';

export default function CategoriesDataTable({ categories }: { categories: CategoryItem[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null);
    const [deletingCategory, setDeletingCategory] = React.useState<CategoryItem | null>(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Form states
    const [images, setImages] = React.useState<File[]>([]);
    const [editImages, setEditImages] = React.useState<File[]>([]);

    const { data, setData, processing, errors, reset } = useForm<Required<CreateCategoryItem>>({
        name: '',
        slug: '',
        color: '',
        image: null,
        description: '',
    });

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm<Required<CreateCategoryItem>>({
        name: '',
        slug: '',
        color: '',
        image: null,
        description: '',
    });

    // Client-side validation states
    const [clientErrors, setClientErrors] = React.useState({
        name: '',
        color: '',
        image: '',
        description: '',
    });

    const [editClientErrors, setEditClientErrors] = React.useState({
        name: '',
        color: '',
        image: '',
        description: '',
    });

    // Actions column definition
    const getColumns = (): ColumnDef<CategoryItem>[] => [
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }) => {
                const imagePath = row.original.image?.startsWith('categories/') ? `/storage/${row.original.image}` : row.original.image;
                return (
                    <div className="flex items-center justify-center">
                        {imagePath ? (
                            <img src={imagePath} alt={row.getValue('name')} width={40} height={40} className="rounded-md object-cover" />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                                <span className="text-xs text-gray-500">No image</span>
                            </div>
                        )}
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
                const category = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCategory(category)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteCategory(category)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                );
            },
        },
    ];

    const columns = getColumns();

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
                Color: rowData.color,
                Description: rowData.description,
                Image: rowData.image,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        XLSX.writeFile(workbook, 'categories.xlsx');
    };

    // Validation function for add form
    const validate = () => {
        const newErrors = {
            name: '',
            color: '',
            image: '',
            description: '',
        };

        let isValid = true;

        if (!data.name?.trim()) {
            newErrors.name = 'The category name is required.';
            isValid = false;
        }
        if (!data.color?.trim()) {
            newErrors.color = 'The color class is required.';
            isValid = false;
        }
        if (images.length === 0) {
            newErrors.image = 'An image is required.';
            isValid = false;
        }
        if (!data.description?.trim()) {
            newErrors.description = 'The description is required.';
            isValid = false;
        }

        setClientErrors(newErrors);
        return isValid;
    };

    // Validation function for edit form
    const validateEdit = () => {
        const newErrors = {
            name: '',
            color: '',
            image: '',
            description: '',
        };

        let isValid = true;

        if (!editData.name?.trim()) {
            newErrors.name = 'The category name is required.';
            isValid = false;
        }
        if (!editData.color?.trim()) {
            newErrors.color = 'The color class is required.';
            isValid = false;
        }
        if (!editData.description?.trim()) {
            newErrors.description = 'The description is required.';
            isValid = false;
        }

        setEditClientErrors(newErrors);
        return isValid;
    };

    // Handle cancel for add form
    const handleCancel = () => {
        reset();
        setImages([]);
        setClientErrors({ name: '', color: '', image: '', description: '' });
        setShowAddDialog(false);
    };

    // Handle cancel for edit form
    const handleEditCancel = () => {
        resetEdit();
        setEditImages([]);
        setEditClientErrors({ name: '', color: '', image: '', description: '' });
        setShowEditDialog(false);
        setEditingCategory(null);
    };

    // Handle edit category
    const handleEditCategory = (category: CategoryItem) => {
        setEditingCategory(category);
        setEditData({
            name: category.name,
            slug: category.slug,
            color: category.color,
            image: null,
            description: category.description || '',
        });
        setEditImages([]);
        setEditClientErrors({ name: '', color: '', image: '', description: '' });
        setShowEditDialog(true);
    };

    // Handle delete category
    const handleDeleteCategory = (category: CategoryItem) => {
        setDeletingCategory(category);
        setShowDeleteDialog(true);
    };

    // Submit add form
    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setClientErrors({ name: '', color: '', image: '', description: '' });

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('color', data.color);
        formData.append('description', data.description || '');
        if (images[0]) {
            formData.append('image', images[0]);
        }

        router.post('/dashboard/categories', formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImages([]);
                setShowAddDialog(false);
                toast.success('Category created successfully!', {
                    description: `${data.name} has been added to your categories.`,
                });
            },
            onError: (serverErrors) => {
                console.error('Server errors:', serverErrors);
                toast.error('Failed to create category', {
                    description: 'Please check the form for errors and try again.',
                });
            },
        });
    };

    // Submit edit form
    const submitEdit: React.FormEventHandler = (e) => {
        e.preventDefault();

        if (!validateEdit()) {
            return;
        }

        setEditClientErrors({ name: '', color: '', image: '', description: '' });

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editData.name);
        formData.append('color', editData.color);
        formData.append('description', editData.description || '');
        if (editImages[0]) {
            formData.append('image', editImages[0]);
        }

        router.post(`/dashboard/categories/${editingCategory?.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                resetEdit();
                setEditImages([]);
                setShowEditDialog(false);
                setEditingCategory(null);
                toast.success('Category updated successfully!', {
                    description: `${editData.name} has been updated.`,
                });
            },
            onError: (serverErrors) => {
                console.error('Server errors:', serverErrors);
                toast.error('Failed to update category', {
                    description: 'Please check the form for errors and try again.',
                });
            },
        });
    };

    // Confirm delete
    const confirmDelete = () => {
        if (!deletingCategory) return;

        router.delete(`/dashboard/categories/${deletingCategory.id}`, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeletingCategory(null);
                toast.success('Category deleted successfully!', {
                    description: `${deletingCategory.name} has been deleted.`,
                });
            },
            onError: (error) => {
                console.error('Delete error:', error);
                toast.error('Failed to delete category', {
                    description: 'An error occurred while trying to delete the category.',
                });
            },
        });
    };

    // Bulk delete selected categories
    const handleBulkDelete = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedIds = selectedRows.map((row) => row.original.id);

        if (selectedIds.length === 0) {
            toast.error('No categories selected', {
                description: 'Please select categories to delete.',
            });
            return;
        }

        router.delete('/dashboard/categories/bulk-delete', {
            data: { ids: selectedIds },
            onSuccess: () => {
                setRowSelection({});
                toast.success(`${selectedIds.length} categories deleted successfully!`, {
                    description: 'The selected categories have been removed.',
                });
            },
            onError: (error) => {
                console.error('Bulk delete error:', error);
                toast.error('Failed to delete categories', {
                    description: 'An error occurred while trying to delete the selected categories.',
                });
            },
        });
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                        <p className="text-muted-foreground text-sm">Manage your shop Categories</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>

                        {/* Bulk Delete Button */}
                        {Object.keys(rowSelection).length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDelete}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Selected ({Object.keys(rowSelection).length})
                            </Button>
                        )}

                        {/* Add New Dialog */}
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[750px]">
                                <form onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle>Add New Category</DialogTitle>
                                        <DialogDescription>Fill in the details to add a new category to your inventory.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Category Name</Label>
                                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                <InputError message={errors.name || clientErrors.name} className="mt-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category Tailwind Color Class eg bg-slate-100</Label>
                                                <Input id="category" value={data.color} onChange={(e) => setData('color', e.target.value)} />
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
                                            <InputError message={errors.description || clientErrors.description} className="mt-2" />
                                        </div>
                                        <div className="mb-8">
                                            <h2 className="mb-3 text-lg font-semibold">Upload Category Image</h2>
                                            <div className="rounded border p-4">
                                                <CompactFileInput multiple={false} maxSizeMB={1} onChange={setImages} />
                                                <InputError message={errors.image || clientErrors.image} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={handleCancel}>
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

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[750px]">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update the category details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Category Name</Label>
                                    <Input id="edit-name" value={editData.name} onChange={(e) => setEditData('name', e.target.value)} />
                                    <InputError message={editErrors.name || editClientErrors.name} className="mt-2" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-color">Category Tailwind Color Class</Label>
                                    <Input id="edit-color" value={editData.color} onChange={(e) => setEditData('color', e.target.value)} />
                                    <InputError message={editErrors.color || editClientErrors.color} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="edit-description">Category Description</Label>
                                <Textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    placeholder="Type your message here."
                                    id="edit-description"
                                />
                                <InputError message={editErrors.description || editClientErrors.description} className="mt-2" />
                            </div>

                            {/* Current Image Display */}
                            {editingCategory?.image && (
                                <div className="space-y-2">
                                    <Label>Current Image</Label>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                editingCategory.image.startsWith('categories/')
                                                    ? `/storage/${editingCategory.image}`
                                                    : editingCategory.image
                                            }
                                            alt={editingCategory.name}
                                            className="h-20 w-20 rounded-md border object-cover"
                                        />
                                        <span className="text-muted-foreground text-sm">Current category image</span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h2 className="mb-3 text-lg font-semibold">Update Category Image (Optional)</h2>
                                <div className="rounded border p-4">
                                    <CompactFileInput multiple={false} maxSizeMB={1} onChange={setEditImages} />
                                    <InputError message={editErrors.image || editClientErrors.image} className="mt-2" />
                                    <p className="text-muted-foreground mt-2 text-sm">Leave empty to keep current image</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleEditCancel}>
                                Cancel
                            </Button>
                            <Button disabled={editProcessing} type="submit">
                                {editProcessing ? 'Updating...' : 'Update Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete the category "{deletingCategory?.name}". This action cannot be undone and will also
                            delete the associated image.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingCategory(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-orange-500 text-white hover:bg-orange-600" onClick={confirmDelete}>
                            Delete Category
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
