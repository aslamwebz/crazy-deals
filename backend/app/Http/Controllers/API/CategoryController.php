<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CategoryCollection;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();

        return new CategoryCollection($categories);
    }

    public function tree()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();

        return new CategoryCollection($categories);
    }

    public function show(Category $category)
    {
        $category->load(['products' => function($query) {
            $query->where('status', 'active')
                ->with(['images', 'defaultItem'])
                ->orderBy('created_at', 'desc');
        }]);

        return new CategoryResource($category);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return new CategoryResource($category);
    }

    public function destroy(Category $category)
    {
        if ($category->children()->exists() || $category->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category with subcategories or products'
            ], 422);
        }

        $category->delete();
        return response()->noContent();
    }
}
