<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Will be handled by policies
    }

    public function rules()
    {
        return [
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'sometimes|required|string|min:10|max:2000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max per image
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'exists:review_images,id,review_id,' . $this->route('review')->id,
        ];
    }

    public function messages()
    {
        return [
            'rating.required' => 'Please provide a rating.',
            'comment.required' => 'Please provide a review comment.',
            'comment.min' => 'Your review must be at least 10 characters long.',
            'images.max' => 'You can upload a maximum of 5 images.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Only JPG, PNG, and GIF images are allowed.',
            'images.*.max' => 'Each image must not be larger than 5MB.',
            'remove_images.*.exists' => 'One or more images to remove are invalid.',
        ];
    }
}
