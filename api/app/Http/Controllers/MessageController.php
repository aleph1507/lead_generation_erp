<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Message;
use Illuminate\Http\Request;
use App\Traits\ValidateAndCreate;

class MessageController extends Controller
{
    use ValidateAndCreate;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return MessageResource::collection(Message::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return MessageResource
     */
    public function store(Request $request)
    {
        return new MessageResource($this->storeModel(
            new Message(),
            $request,
            [
                'text' => 'required|string',
                'approval_request' => 'sometimes|in:PENDING,APPROVED,REJECTED,ALTERED'
            ]
        ));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Message  $message
     * @return MessageResource
     */
    public function show(Message $message)
    {
        return new MessageResource($message);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Message  $message
     * @return MessageResource
     */
    public function update(Request $request, Message $message)
    {
        return new MessageResource($this->storeModel(
            $message,
            $request,
            [
                'text' => 'sometimes|string',
                'approval_request' => 'sometimes|in:PENDING,APPROVED,REJECTED,ALTERED'
            ]
        ));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Message $message
     * @return Message
     * @throws \Exception
     */
    public function destroy(Message $message)
    {
        $message->delete();
        return $message;
    }
}
