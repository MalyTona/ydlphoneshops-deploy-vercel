<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get IDs for categories and brands to create relationships
        $newPhonesCat = Category::where('slug', 'new-phones')->first()->id;
        $usedPhonesCat = Category::where('slug', 'used-phones')->first()->id;
        $accessoriesCat = Category::where('slug', 'accessories')->first()->id;

        $appleBrand = Brand::where('slug', 'apple')->first()->id;
        $samsungBrand = Brand::where('slug', 'samsung')->first()->id;
        $googleBrand = Brand::where('slug', 'google')->first()->id;

        $products = [
            [
                'name' => 'iPhone 15 Pro - 256GB',
                'slug' => 'iphone-15-pro-256gb',
                'category_id' => $newPhonesCat,
                'brand_id' => $appleBrand,
                'short_description' => 'Natural Titanium finish, A17 Pro chip, and Pro camera system.',
                'full_description' => 'Experience the future with the iPhone 15 Pro. Powered by the A17 Pro chip, it delivers unparalleled performance. The advanced pro-grade camera system captures breathtaking detail.',
                'price' => 1099.00,
                'original_price' => 1199.00,
                'stock' => 50,
                'is_new' => true,
                'images' => json_encode(['/images/products/iphone15pro.png', '/images/products/iphone15pro-2.png']),
                'features' => json_encode(['6.1" Super Retina XDR', 'A17 Pro Chip', 'USB-C Connectivity', '5x Optical Zoom']),
                'colors' => json_encode([
                    ['name' => 'Natural Titanium', 'hexValue' => '#8A8A8D'],
                    ['name' => 'Blue Titanium', 'hexValue' => '#2A3C4B'],
                ]),
                'storage_options' => json_encode(['128GB', '256GB', '512GB', '1TB']),
                'rating' => 4.9,
                'review_count' => 180,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra - 512GB',
                'slug' => 'samsung-galaxy-s24-ultra-512gb',
                'category_id' => $newPhonesCat,
                'brand_id' => $samsungBrand,
                'short_description' => 'Galaxy AI is here. Search, chat, and create like never before.',
                'full_description' => 'The Galaxy S24 Ultra sets the standard for premium Android devices with its integrated S Pen, AI-powered features, and a stunning 200MP main camera.',
                'price' => 1299.00,
                'original_price' => 1399.00,
                'stock' => 35,
                'is_new' => true,
                'images' => json_encode(['/images/products/s24ultra.png']),
                'features' => json_encode(['6.8" Dynamic AMOLED 2X', 'Integrated S Pen', '200MP Camera', 'AI Features']),
                'colors' => json_encode([
                    ['name' => 'Titanium Gray', 'hexValue' => '#8D949A'],
                    ['name' => 'Titanium Violet', 'hexValue' => '#9370DB'],
                ]),
                'storage_options' => json_encode(['256GB', '512GB', '1TB']),
                'rating' => 4.8,
                'review_count' => 155,
            ],
            [
                'name' => 'Certified Pre-Owned iPhone 13 - 128GB',
                'slug' => 'used-iphone-13-128gb',
                'category_id' => $usedPhonesCat,
                'brand_id' => $appleBrand,
                'short_description' => 'Excellent condition, fully unlocked. Includes 1-year YDL warranty.',
                'full_description' => 'A great value deal. The iPhone 13 features the powerful A15 Bionic chip, a beautiful Super Retina XDR display, and an advanced dual-camera system. All our pre-owned devices undergo rigorous testing.',
                'price' => 499.00,
                'original_price' => 699.00,
                'stock' => 20,
                'is_new' => false,
                'images' => json_encode(['/images/products/iphone13.png']),
                'features' => json_encode(['6.1" Super Retina XDR', 'A15 Bionic Chip', 'Cinematic Mode']),
                'colors' => json_encode([['name' => 'Midnight', 'hexValue' => '#1C1C1E']]),
                'storage_options' => json_encode(['128GB', '256GB']),
                'rating' => 4.7,
                'review_count' => 98,
            ],
            [
                'name' => 'Fast Charge Power Bank 20000mAh',
                'slug' => 'powerbank-20000mah-fastcharge',
                'category_id' => $accessoriesCat,
                'brand_id' => $samsungBrand, // Or a generic/accessory brand
                'short_description' => 'USB-C PD, charges phones and tablets quickly on the go.',
                'full_description' => 'Never run out of power with this high-capacity 20000mAh power bank. Features USB-C Power Delivery for fast charging your devices.',
                'price' => 39.99,
                'original_price' => 49.99,
                'stock' => 150,
                'is_new' => true,
                'images' => json_encode(['/images/products/powerbank.png']),
                'features' => json_encode(['20000mAh Capacity', 'USB-C Power Delivery', 'Dual Device Charging']),
                'colors' => json_encode([['name' => 'Black', 'hexValue' => '#000000']]),
                'storage_options' => json_encode([]),
                'rating' => 4.5,
                'review_count' => 75,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['slug' => $product['slug']], $product);
        }
    }
}