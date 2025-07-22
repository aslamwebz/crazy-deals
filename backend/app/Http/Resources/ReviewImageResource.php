<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ReviewImageResource extends BaseResource
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
            'review_id' => $this->review_id,
            'url' => $this->url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'thumbnail_url' => $this->getThumbnailUrl(),
            'medium_url' => $this->getMediumUrl(),
        ];
    }

    /**
     * Get the thumbnail URL for the image.
     *
     * @return string
     */
    protected function getThumbnailUrl()
    {
        // Assuming you have an image service that can generate different sizes
        return $this->url ? str_replace('.jpg', '-thumb.jpg', $this->url) : null;
    }

    /**
     * Get the medium-sized URL for the image.
     *
     * @return string
     */
    protected function getMediumUrl()
    {
        // Assuming you have an image service that can generate different sizes
        return $this->url ? str_replace('.jpg', '-medium.jpg', $this->url) : null;
    }
}
