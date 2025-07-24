<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class CategoryResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'parent_id' => $this->parent_id,
            'image' => $this->image,
            'icon' => $this->icon,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'children' => $this->whenLoaded('children', function () {
                return CategoryResource::collection($this->children);
            }),
            'parent' => $this->whenLoaded('parent', function () {
                return new CategoryResource($this->parent);
            }),
            'products_count' => $this->when(isset($this->products_count), $this->products_count),
            'url' => url('/api/categories/' . $this->slug),
        ];
    }

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        if ($this->wasRecentlyCreated) {
            return 'Category created successfully.';
        }

        if ($this->wasChanged()) {
            return 'Category updated successfully.';
        }

        return null;
    }
}
