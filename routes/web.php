<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Use aliases to distinguish between your two controllers
use App\Http\Controllers\Shop\CategoryController as ShopCategoryController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;

Route::get('/', [ShopCategoryController::class, 'get_category_data'])->name('home');

// Fixed the duplicate route name for the detail page
Route::get('/detail', function () {
    return Inertia::render('product-details');
})->name('product.details');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');

    Route::get('dashboard/homebanner', function () {
        return Inertia::render('dashboard/homebanner/index');
    })->name('homebanner');

    Route::get('dashboard/products', function () {
        return Inertia::render('dashboard/products/index');
    })->name('products');
    
    Route::get('dashboard/categories', function () {
        return Inertia::render('dashboard/categories/index');
    })->name('dashboard.categories.index');
    
    // CORRECTED ROUTE: This now points to the Admin controller and the 'store' method.
    Route::post('/dashboard/categories', [AdminCategoryController::class, 'store'])->name('dashboard.categories.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';