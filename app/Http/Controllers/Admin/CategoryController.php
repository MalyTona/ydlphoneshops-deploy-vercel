<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            // It's good practice to ensure the name/slug will be unique in the database
            'name' => 'required|string|max:255|unique:categories,name',
            'color' => 'nullable|string|max:255',
            // Added mimes for better security, ensuring only specific image types are uploaded
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', 
            'description' => 'nullable|string|max:1000',
        ]);

        $dataToCreate = $validatedData;
        $dataToCreate['slug'] = Str::slug($validatedData['name']);

        // Handle the file upload if an image exists in the request
        if ($request->hasFile('image')) {
            $dataToCreate['image'] = $request->file('image')->store('categories', 'public');
        }

        // Use a default color if one isn't provided
        $dataToCreate['color'] = $request->color ?? 'bg-yellow-100 dark:bg-yellow-700/40';

        // Create the new category
        Category::create($dataToCreate);

        
        return to_route('dashboard.categories.index');
    }
}