<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class BaseCollection extends ResourceCollection
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string
     */
    public static $wrap = 'data';

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }

    /**
     * Get any additional data that should be returned with the resource array.
     *
     * @param  \Illuminate\Http\Request  $request
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
        $meta = [
            'api_version' => config('app.api_version', '1.0'),
            'timestamp' => now()->toDateTimeString(),
        ];

        // Add pagination meta if the collection is paginated
        if ($this->resource instanceof \Illuminate\Pagination\AbstractPaginator) {
            $meta['pagination'] = [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => (int) $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage(),
                'links' => [
                    'first' => $this->url(1),
                    'last' => $this->url($this->lastPage()),
                    'prev' => $this->previousPageUrl(),
                    'next' => $this->nextPageUrl(),
                ],
            ];
        }

        return $meta;
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
