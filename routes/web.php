<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Shop\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products/{slug}', [HomeController::class, 'show_detail'])->name('detail');

// Banner Routes
Route::get('dashboard/homebanner', [BannerController::class, 'index'])->name('dashboard.homebanner.index');
Route::post('dashboard/homebanner', [BannerController::class, 'store'])->name('dashboard.homebanner.store');
Route::patch('homebanner/{banner}/toggle', [BannerController::class, 'toggleStatus'])->name('dashboard.homebanner.toggle');

// Authenticated and Verified Routes
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');

    // Product Routes
    Route::get('/dashboard/products', [ProductController::class, 'list_products'])->name('dashboard.products.index');
    Route::post('/dashboard/products', [ProductController::class, 'save_product'])->name('dashboard.products.save');

    // Category Routes
    Route::get('/dashboard/categories', [CategoryController::class, 'list_categories'])->name('dashboard.categories.index');
    Route::post('/dashboard/categories', [CategoryController::class, 'save_category'])->name('dashboard.categories.save');
    Route::get('/dashboard/categories/{id}', [CategoryController::class, 'show_category'])->name('dashboard.categories.show');
    Route::put('/dashboard/categories/{id}', [CategoryController::class, 'update_category'])->name('dashboard.categories.update');
    Route::delete('/dashboard/categories/{id}', [CategoryController::class, 'delete_category'])->name('dashboard.categories.delete');
    Route::delete('/dashboard/categories/bulk-delete', [CategoryController::class, 'bulk_delete'])->name('dashboard.categories.bulk_delete');
});

// Additional Route Files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
