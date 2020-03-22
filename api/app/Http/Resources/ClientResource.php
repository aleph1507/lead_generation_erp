<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
//        'name', 'description'
        if (is_object($this) && isset($this->resource) && is_bool($this->resource)) {
            return ['success' => $this->resource];
        }
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'no_leads' => $this->leads->count(),
            'created_at' => $this->created_at->toDateString(),
            'updated_at' => $this->updated_at->toDateString()
        ];
//        return parent::toArray($request);
    }
}
