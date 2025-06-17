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
            'banners' => Banner::orderBy('sort_order', 'asc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'link_url' => 'nullable|string|max:255',
            'alt' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $dataToCreate = $validatedData;

        if ($request->hasFile('image')) {
            $dataToCreate['image_url'] = $request->file('image')->store('banners', 'public');
            unset($dataToCreate['image']); 
        }

        if (!isset($dataToCreate['sort_order'])) {
            $dataToCreate['sort_order'] = Banner::max('sort_order') + 1;
        }

        Banner::create($dataToCreate);

        return to_route('dashboard.homebanner.index')->with('success', 'Banner created successfully.');
    }

    /**
     * Toggles the active status of a banner.
     */
    public function toggleStatus(Banner $banner)
    {
        $banner->is_active = !$banner->is_active;
        $banner->save();

        return back()->with('success', 'Banner status updated.');
    }
}