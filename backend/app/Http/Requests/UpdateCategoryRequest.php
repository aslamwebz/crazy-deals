<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Will be handled by policies
    }

    public function rules()
    {
        $categoryId = $this->route('category');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:categories,slug,' . $categoryId,
            'parent_id' => 'nullable|exists:categories,id|not_in:' . $categoryId,
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'order' => 'integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'parent_id.not_in' => 'A category cannot be its own parent.',
        ];
    }
}
