<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Featured Products
        $featuredProducts = [
            [
                'id' => 1,
                'sku' => 'SGS24ULTRA',
                'category_id' => 1, // Electronics
                'name' => 'Samsung Galaxy S24 Ultra',
                'slug' => Str::slug('Samsung Galaxy S24 Ultra'),
                'description' => 'The latest flagship smartphone from Samsung with advanced camera features and powerful performance.',
                'short_description' => 'Flagship smartphone with advanced camera',
                'price' => 1199.00,
                'compare_at_price' => 1399.00,
                'quantity' => 50,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => false,
                'status' => 'active',
                'rating' => 4.8,
                'reviews_count' => 324,
                'badge' => 'New',
                'badge_color' => 'bg-green-500',
                'images' => [
                    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 2,
                'sku' => 'AIRPODSPRO2',
                'category_id' => 1, // Electronics
                'name' => 'Apple AirPods Pro 2',
                'slug' => Str::slug('Apple AirPods Pro 2'),
                'description' => 'Premium wireless earbuds with active noise cancellation and spatial audio.',
                'short_description' => 'Premium wireless earbuds with ANC',
                'price' => 199.00,
                'compare_at_price' => 249.00,
                'quantity' => 100,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => false,
                'status' => 'active',
                'rating' => 4.9,
                'reviews_count' => 156,
                'badge' => 'Hot',
                'badge_color' => 'bg-red-500',
                'images' => [
                    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 3,
                'sku' => 'DELLXPS13',
                'category_id' => 1, // Electronics
                'name' => 'Dell XPS 13 Laptop',
                'slug' => Str::slug('Dell XPS 13 Laptop'),
                'description' => 'Ultra-thin and light laptop with stunning 4K display and powerful performance.',
                'short_description' => 'Ultra-thin and light laptop',
                'price' => 899.00,
                'compare_at_price' => 1199.00,
                'quantity' => 30,
                'is_featured' => true,
                'is_trending' => false,
                'is_flash_deal' => false,
                'status' => 'active',
                'rating' => 4.7,
                'reviews_count' => 89,
                'badge' => 'Limited',
                'badge_color' => 'bg-orange-500',
                'images' => [
                    'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 4,
                'sku' => 'IPADAIR5',
                'category_id' => 1, // Electronics
                'name' => 'iPad Air 5th Gen',
                'slug' => Str::slug('iPad Air 5th Gen'),
                'description' => 'Powerful and versatile tablet with M1 chip and stunning Liquid Retina display.',
                'short_description' => 'Powerful tablet with M1 chip',
                'price' => 549.00,
                'compare_at_price' => 649.00,
                'quantity' => 45,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => false,
                'status' => 'active',
                'rating' => 4.8,
                'reviews_count' => 203,
                'badge' => 'Sale',
                'badge_color' => 'bg-blue-500',
                'images' => [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 5,
                'sku' => 'NSWITOLED',
                'category_id' => 1, // Electronics
                'name' => 'Nintendo Switch OLED',
                'slug' => Str::slug('Nintendo Switch OLED'),
                'description' => 'The latest Nintendo Switch model with a vibrant 7-inch OLED screen and enhanced audio.',
                'short_description' => 'Handheld gaming console with OLED screen',
                'price' => 299.00,
                'compare_at_price' => 349.00,
                'quantity' => 35,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => false,
                'status' => 'active',
                'rating' => 4.6,
                'reviews_count' => 445,
                'badge' => 'Popular',
                'badge_color' => 'bg-purple-500',
                'images' => [
                    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 6,
                'sku' => 'SONYXM4',
                'category_id' => 1, // Electronics
                'name' => 'Sony WF-1000XM4',
                'slug' => Str::slug('Sony WF-1000XM4'),
                'description' => 'Industry-leading noise cancellation with exceptional sound quality and all-day comfort.',
                'short_description' => 'Premium noise-canceling earbuds',
                'price' => 229.00,
                'compare_at_price' => 279.00,
                'quantity' => 60,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => false,
                'status' => 'active',
                'rating' => 4.7,
                'reviews_count' => 167,
                'badge' => 'Choice',
                'badge_color' => 'bg-yellow-500',
                'images' => [
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
                ]
            ],
        ];

        // Flash Deals
        $flashDeals = [
            [
                'id' => 7,
                'sku' => 'IPHONE15PM',
                'category_id' => 1, // Electronics
                'name' => 'iPhone 15 Pro Max',
                'slug' => Str::slug('iPhone 15 Pro Max'),
                'description' => 'The most advanced iPhone with Pro camera system and A17 Pro chip.',
                'short_description' => 'Most advanced iPhone with Pro camera',
                'price' => 899.00,
                'compare_at_price' => 1199.00,
                'quantity' => 50,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => true,
                'flash_deal_starts_at' => now(),
                'flash_deal_ends_at' => now()->addDays(7),
                'status' => 'active',
                'rating' => 4.8,
                'sold_quantity' => 24,
                'total_quantity' => 50,
                'badge' => 'Deal',
                'badge_color' => 'bg-red-600',
                'images' => [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 8,
                'sku' => 'NIKE270',
                'category_id' => 2, // Fashion
                'name' => 'Nike Air Max 270',
                'slug' => Str::slug('Nike Air Max 270'),
                'description' => 'Iconic Nike Air Max 270 with lightweight design and responsive cushioning.',
                'short_description' => 'Iconic Nike Air Max 270',
                'price' => 89.00,
                'compare_at_price' => 150.00,
                'quantity' => 30,
                'is_featured' => false,
                'is_trending' => true,
                'is_flash_deal' => true,
                'flash_deal_starts_at' => now(),
                'flash_deal_ends_at' => now()->addDays(7),
                'status' => 'active',
                'rating' => 4.6,
                'sold_quantity' => 18,
                'total_quantity' => 30,
                'badge' => 'Hot',
                'badge_color' => 'bg-orange-500',
                'images' => [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 9,
                'sku' => 'MBAM2',
                'category_id' => 1, // Electronics
                'name' => 'MacBook Air M2',
                'slug' => Str::slug('MacBook Air M2'),
                'description' => 'Incredibly thin and light laptop with M2 chip and all-day battery life.',
                'short_description' => 'Thin and light laptop with M2 chip',
                'price' => 999.00,
                'compare_at_price' => 1299.00,
                'quantity' => 25,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => true,
                'flash_deal_starts_at' => now(),
                'flash_deal_ends_at' => now()->addDays(7),
                'status' => 'active',
                'rating' => 4.9,
                'sold_quantity' => 12,
                'total_quantity' => 25,
                'badge' => 'Limited',
                'badge_color' => 'bg-purple-600',
                'images' => [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
                ]
            ],
            [
                'id' => 10,
                'sku' => 'SONYWHXM5',
                'category_id' => 1, // Electronics
                'name' => 'Sony WH-1000XM5',
                'slug' => Str::slug('Sony WH-1000XM5'),
                'description' => 'Premium wireless noise-canceling headphones with industry-leading sound quality.',
                'short_description' => 'Premium noise-canceling headphones',
                'price' => 279.00,
                'compare_at_price' => 399.00,
                'quantity' => 40,
                'is_featured' => true,
                'is_trending' => true,
                'is_flash_deal' => true,
                'flash_deal_starts_at' => now(),
                'flash_deal_ends_at' => now()->addDays(7),
                'status' => 'active',
                'rating' => 4.7,
                'sold_quantity' => 31,
                'total_quantity' => 40,
                'badge' => 'Deal',
                'badge_color' => 'bg-blue-600',
                'images' => [
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
                ]
            ],
        ];

        // Create featured products
        foreach ($featuredProducts as $productData) {
            $images = $productData['images'];
            unset($productData['images']);
            
            $product = Product::create($productData);
            
            // Add product images
            foreach ($images as $index => $imageUrl) {
                $product->images()->create([
                    'url' => $imageUrl,
                    'is_primary' => $index === 0,
                    'order' => $index,
                ]);
            }
        }

        // Create flash deals
        foreach ($flashDeals as $productData) {
            $images = $productData['images'];
            unset($productData['images']);
            
            $product = Product::create($productData);
            
            // Create product images
            foreach ($images as $index => $imageUrl) {
                $product->images()->create([
                    'url' => $imageUrl,
                    'is_primary' => $index === 0,
                    'order' => $index,
                ]);
            }
        }
    }
}
