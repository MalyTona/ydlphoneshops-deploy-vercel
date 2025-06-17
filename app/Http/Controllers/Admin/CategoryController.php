<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     * Renders the category management page using Inertia.
     */
    public function list_categories()
    {
        $categories = Category::latest()->get();

        return Inertia::render('dashboard/categories/index', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created category in storage.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function save_category(Request $request)
    {
        try {
            $request->validate([
                'name'        => 'string|required|max:255|unique:categories,name',
                'color'       => 'string|required',
                'description' => 'string|nullable',
                'image'       => 'image|nullable|max:2048' // Max 2MB
            ]);

            // Create a URL-friendly slug from the name
            $slug = Str::slug($request->name);
            $imagePath = '';

            // Handle the image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('categories', 'public');
            }

            // Prepare data for new category
            $new_category = [
                'name'        => $request->name,
                'slug'        => $slug,
                'image'       => $imagePath,
                'color'       => $request->color,
                'description' => $request->description,
            ];

            // Create the category
            Category::create($new_category);

            return redirect()->route('dashboard.categories.index')
                ->with('success', 'Category created successfully!');

        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to create category. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Display the specified category.
     * Used for fetching data for an edit form, for example.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show_category($id)
    {
        try {
            $category = Category::findOrFail($id);
            return response()->json($category);

        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error("Error fetching category {$id}: " . $e->getMessage());
            // Return a 404 Not Found response
            return response()->json(['error' => 'Category not found.'], 404);
        }
    }

    /**
     * Update the specified category in storage.
     * Note: Laravel handles PUT/PATCH requests via POST with a hidden `_method` field.
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update_category(Request $request, $id)
    {
        try {
            $request->validate([
                'name'        => 'string|required|max:255|unique:categories,name,' . $id,
                'color'       => 'string|required',
                'description' => 'string|nullable',
                // 'image' can be nullable if the user doesn't want to change it
                'image'       => 'image|nullable|max:2048'
            ]);

            $category = Category::findOrFail($id);

            // Start with the existing data
            $updateData = [
                'name'        => $request->name,
                'slug'        => Str::slug($request->name),
                'color'       => $request->color,
                'description' => $request->description,
            ];

            // Check if a new image has been uploaded
            if ($request->hasFile('image')) {
                // Delete the old image if it exists
                if ($category->image && Storage::disk('public')->exists($category->image)) {
                    Storage::disk('public')->delete($category->image);
                }
                // Store the new image and update the path
                $updateData['image'] = $request->file('image')->store('categories', 'public');
            }

            $category->update($updateData);

            return redirect()->route('dashboard.categories.index')
                ->with('success', 'Category updated successfully!');

        } catch (\Exception $e) {
            Log::error("Error updating category {$id}: " . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to update category. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified category from storage.
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete_category($id)
    {
        try {
            $category = Category::findOrFail($id);

            // Delete the image from storage if it exists
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            // Delete the category from the database
            $category->delete();

            return redirect()->route('dashboard.categories.index')
                ->with('success', 'Category deleted successfully!');

        } catch (\Exception $e) {
            Log::error("Error deleting category {$id}: " . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete category.']);
        }
    }

    /**
     * Remove multiple categories from storage.
     * Expects a request with an 'ids' key containing an array of category IDs.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulk_delete(Request $request)
    {
        try {
            $request->validate([
                'ids'   => 'required|array',
                'ids.*' => 'integer|exists:categories,id' // Validate each item in the array
            ]);

            $categoryIds = $request->input('ids');

            // Find all categories to be deleted
            $categories = Category::whereIn('id', $categoryIds)->get();

            foreach ($categories as $category) {
                // Delete associated image from storage
                if ($category->image && Storage::disk('public')->exists($category->image)) {
                    Storage::disk('public')->delete($category->image);
                }
            }

            // Delete all categories from the database in a single query
            Category::destroy($categoryIds);

            return redirect()->route('dashboard.categories.index')
                ->with('success', 'Selected categories have been deleted successfully!');

        } catch (\Exception $e) {
            Log::error('Error during bulk delete of categories: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete selected categories.']);
        }
    }
}