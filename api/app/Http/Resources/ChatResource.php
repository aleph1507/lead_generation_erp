<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if (is_object($this) && isset($this->resource) && is_bool($this->resource)) {
            return ['success' => $this->resource];
        }
        return [
            'id' => $this->id,
            'message' => $this->message,
            'response' => $this->response,
            'client_id' => $this->client_id,
            'lead_id' => $this->lead_id,
            'client' => $this->client ? $this->client : null,
            'lead' => $this->lead ? $this->lead : null,
            'created_at' => $this->created_at->toDateString(),
            'updated_at' => $this->updated_at->toDateString()
        ];
//        return parent::toArray($request);
    }
}
