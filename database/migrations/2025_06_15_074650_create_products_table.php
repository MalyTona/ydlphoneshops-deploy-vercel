<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();

            // Foreign keys for relationships (better than storing strings)
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();

            $table->text('short_description')->nullable();
            $table->longText('full_description')->nullable();
            
            // Use decimal for prices to avoid floating point inaccuracies
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();

            $table->unsignedInteger('stock')->default(0);
            $table->boolean('is_new')->default(false);

            // Storing arrays as JSON is the best way in a database
            $table->json('images'); // For the array of image paths
            $table->json('features')->nullable();
            $table->json('colors')->nullable();
            $table->json('storage_options')->nullable();
            
            // Rating and review info
            $table->float('rating', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
