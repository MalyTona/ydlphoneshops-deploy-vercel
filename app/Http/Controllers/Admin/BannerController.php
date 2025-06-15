<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use Inertia\Inertia;
class BannerController extends Controller
{
     public function index()
    {
        return Inertia::render('dashboard/homebanner/index', [
            'banners' => Banner::latest()->get(),
        ]);
    }

     public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'link' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $dataToCreate = $validatedData;

        // Handle the file upload
        if ($request->hasFile('image')) {
            $dataToCreate['image'] = $request->file('image')->store('banners', 'public');
        }

        Banner::create($dataToCreate);

        return to_route('dashboard.homebanner.index')->with('success', 'Banner created successfully.');
    }
}
