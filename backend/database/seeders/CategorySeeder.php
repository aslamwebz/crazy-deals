<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Latest electronic gadgets and devices',
                'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
                'icon' => 'Smartphone',
                'color' => 'from-blue-500 to-purple-600',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Fashion',
                'slug' => 'fashion',
                'description' => 'Trendy clothing and accessories',
                'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
                'icon' => 'Shirt',
                'color' => 'from-pink-500 to-rose-500',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'id' => 3,
                'name' => 'Home & Garden',
                'slug' => 'home-garden',
                'description' => 'Everything for your home and garden',
                'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
                'icon' => 'Home',
                'color' => 'from-green-500 to-emerald-600',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'id' => 4,
                'name' => 'Beauty',
                'slug' => 'beauty',
                'description' => 'Beauty and personal care products',
                'image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
                'icon' => 'Sparkles',
                'color' => 'from-purple-500 to-pink-500',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'id' => 5,
                'name' => 'Sports',
                'slug' => 'sports',
                'description' => 'Sports equipment and accessories',
                'image' => 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
                'icon' => 'Gamepad2',
                'color' => 'from-orange-500 to-red-500',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'id' => 6,
                'name' => 'Books',
                'slug' => 'books',
                'description' => 'Books and educational materials',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'icon' => 'Book',
                'color' => 'from-amber-500 to-orange-500',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'id' => 7,
                'name' => 'Automotive',
                'slug' => 'automotive',
                'description' => 'Auto parts and accessories',
                'image' => 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop',
                'icon' => 'Car',
                'color' => 'from-gray-500 to-slate-600',
                'is_active' => true,
                'order' => 7,
            ],
            [
                'id' => 8,
                'name' => 'Gifts',
                'slug' => 'gifts',
                'description' => 'Perfect gifts for every occasion',
                'image' => 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
                'icon' => 'Gift',
                'color' => 'from-red-500 to-pink-500',
                'is_active' => true,
                'order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
