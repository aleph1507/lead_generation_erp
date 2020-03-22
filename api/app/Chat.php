<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{

    protected $fillable = ['client_id', 'lead_id', 'message_id', 'response_id'];

    public function lead()
    {
        return $this->belongsTo('\App\Lead');
    }

    public function client()
    {
        return $this->belongsTo('\App\Client');
    }

    public function message()
    {
        return $this->hasOne('\App\Message');
    }

    public function response()
    {
        return $this->hasOne('\App\Response');
    }

    public function scopeForClient($query, $client_id)
    {
        return $query->where('client_id', $client_id);
    }

    public function scopeForLead($query, $lead_id)
    {
        return $query->where('lead_id', $lead_id);
    }

//    public function getChatsWithPendingMessages()
//    {
//        return $this->where(function ($query) {
//
//        })
//    }

//    public function scopeText($query)
//    {
//        $query = $query->with(['message' => function ($q) {
//            $q->where('message_id', '<>', NULL);
//        }]);
//
//        $query = $query->with(['response' => function ($q) {
//            $q->where('response_id', '<>', NULL);
//        }]);
//
//        return $query;
//    }

}
