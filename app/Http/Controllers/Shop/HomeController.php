<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    // --- This will be the only function for your homepage ---
    public function index()
    {
        return Inertia::render('home', [
            'banners' => Banner::where('is_active', true)->orderBy('sort_order')->get(),
            'categories' => Category::select('id', 'name', 'slug', 'image', 'color')->latest()->get(),
            'products' => Product::with('category')->latest()->take(8)->get(), // Using take(8) from your original index
        ]);
    }

    // --- We no longer need get_home_data() ---

    public function show_detail($slug){
        $product = Product::with('category')
            ->where('slug', $slug)
            ->firstOrFail();

        $similarProducts = Product::similar($product->id)->get();

        return Inertia::render('product-details', [
            'product' => $product,
            'similarProducts' => $similarProducts,
        ]);
    }
}