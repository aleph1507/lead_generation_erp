<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {

//        if ($this->resource && isset($this->resource['success']))
//        {
//            return json_encode(['data' => $this]);
//        }
        if (is_object($this) && isset($this->resource) && is_bool($this->resource)) {
            return ['success' => $this->resource];
        }
        return [
            'id' => $this->id ?: null,
            'duxid' => $this->duxid ?: null,
            'visitTime' => $this->visitTime ?: null,
            'profile' => $this->profile ?: null,
            'picture' => $this->picture ?: null,
            'degree' => $this->degree ?: null,
            'firstName' => $this->firstName ?: null,
            'middleName' => $this->middleName ?: null,
            'lastName' => $this->lastName ?: null,
            'summary' => $this->summary ?: null,
            'title' => $this->title ?: null,
            'from' => $this->from ?: null,
            'company' => $this->company ?: null,
            'companyProfile' => $this->companyProfile ?: null,
            'companyWebsite' => $this->companyWebsite ?: null,
            'personalWebsite' => $this->personalWebsite ?: null,
            'email' => $this->email ?: null,
            'phone' => $this->phone ?: null,
            'IM' => $this->IM ?: null,
            'twitter' => $this->twitter ?: null,
            'location' => $this->location ?: null,
            'industry' => $this->industry ?: null,
            'myTags' => $this->myTags ?: null,
            'myNotes' => $this->myNotes ?: null,
            'status' => $this->status ?: null,
//            'client' => count($this->clients) == 1 ? new ClientResource($this->clients) : ClientResource::collection($this->clients) ?: null,
            'client' => ClientResource::collection($this->clients) ?: null,
            'created_at' => $this->created_at->toDateString() ?: null,
            'updated_at' => $this->updated_at->toDateString()  ?: null
        ];

//        return parent::toArray($request);
    }
}
