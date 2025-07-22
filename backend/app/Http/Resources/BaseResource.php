<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = 'data';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }

    /**
     * Add additional meta data to the resource response.
     *
     * @param  array  $data
     * @return array
     */
    public function with($request)
    {
        return [
            'success' => true,
            'message' => $this->getMessage() ?? 'Request was successful.',
            'meta' => $this->getMeta(),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array
     */
    protected function getMeta()
    {
        return [
            'api_version' => config('app.api_version', '1.0'),
            'timestamp' => now()->toDateTimeString(),
        ];
    }

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return null;
    }

    /**
     * Customize the response for a request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\JsonResponse  $response
     * @return void
     */
    public function withResponse($request, $response)
    {
        $response->setEncodingOptions(JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
}
