<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'image_url' => '/images/YDL-BANNER.jpg',
                'link_url' => '/anniversary-sale',
                'alt' => '12 Years Jumia Anniversary Sale',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'image_url' => '/images/YDLBanner2.png',
                'link_url' => '/summer-collection',
                'alt' => 'Summer Collection Now Available',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'image_url' => '/images/banner.png',
                'link_url' => '/tech-deals',
                'alt' => 'Exclusive Tech Deals',
                'is_active' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::updateOrCreate(['link_url' => $banner['link_url']], $banner);
        }
    }
}