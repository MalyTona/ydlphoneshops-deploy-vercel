<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'category_id', 'brand_id', 'short_description', 
        'full_description', 'price', 'original_price', 'stock', 
        'is_new', 'images', 'features', 'colors', 'storage_options', 
        'rating', 'review_count',
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'images' => 'array',
        'features' => 'array',
        'colors' => 'array',
        'storage_options' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function scopSimilarProducts($query, $productId)
    {
      $product = static::firstOrFail($productId);
      //Category-based similar products 
      return $query->where('category_id', $product->category_id)
                   ->where('id', '!=', $productId)
                   ->orderBy('created_at', 'desc')
                   ->take(4);
    }
}