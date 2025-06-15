<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category; // Import the Category model

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'New Phones',
                'slug' => 'new-phones',
                'image' => 'https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'color' => 'bg-sky-100 dark:bg-sky-700/40',
            ],
            [
                'name' => 'Used Phones',
                'slug' => 'used-phones',
                'image' => 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'color' => 'bg-green-100 dark:bg-green-700/40',
            ],
            [
                'name' => 'Repair Service',
                'slug' => 'repairs',
                'image' => 'https://www.diyfixtool.com/cdn/shop/articles/05qOG26wzVLHG2nlWpelvCF-1..v1683302270_jpg_JPEG_1600x900_71.png?v=1701080915',
                'color' => 'bg-orange-100 dark:bg-orange-700/40',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'color' => 'bg-indigo-100 dark:bg-indigo-700/40',
            ],
            [
                'name' => 'Smartphones',
                'slug' => 'smartphones',
                'image' => 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'color' => 'bg-yellow-100 dark:bg-yellow-700/40',
            ],
            [
                'name' => 'Tablets',
                'slug' => 'tablets',
                'image' => 'https://images.unsplash.com/photo-1585079542156-2755d9c8a094?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'color' => 'bg-purple-100 dark:bg-purple-700/40',
            ],
        ];

        foreach ($categories as $category) {
            // Using updateOrCreate is good practice to prevent duplicates
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}