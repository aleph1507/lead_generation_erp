<?php

namespace App\Http\Controllers;

use App\Chat;
use App\Client;
use App\Http\Resources\ChatResource;
use App\Http\Resources\MessageResource;
use App\Lead;
use App\Message;
use App\Response;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Traits\ValidateAndCreate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ChatController extends Controller
{

    use ValidateAndCreate;

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        return ChatResource::collection(Chat::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return ChatResource | \Exception
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'client_id' => 'required|integer|exists:clients,id',
            'lead_id' => 'required|integer|exists:leads,id',
            'role' => 'required|in:Message,Response,approvalRequest',
            'text' => 'required|string'
        ]);

        if (!($client = Client::find($request->get('client_id'))))
        {
            return new \Exception('cannot find client', 404);
        }

        if (!(Gate::check('can-message', [$client])))
        {
            return new \Exception('unauthorized', 401);
        }

        if (!($role = $request->get('role')))
        {
            return new \Exception('Neither message nor response', 400);
        }

        if (!($text = $request->get('text')))
        {
            return new \Exception('No text for the ' . $role, 400);
        }

//        protected $fillable = ['client_id', 'lead_id', 'message_id', 'response_id'];

        if (($client = Client::find($request->get('client_id'))) && ($lead = Lead::find($request->get('lead_id'))))
        {
            $new_chat = Chat::create();
            if ($role === 'approvalRequest')
            {
                $new_chat->message()->save(Message::create(['text' => $text, 'approval_request' => 'PENDING']));
            }
            else
            {
                $role === 'Message' ?
                    $new_chat->message()->save(Message::create(['text' => $text])) :
                    $new_chat->response()->save(Response::create(['text' => $text]));
            }

            $new_chat->client()->associate($client);
            $new_chat->lead()->associate($lead);

            $new_chat->save();

            return new ChatResource($new_chat);
        }

        return null;

//        $table->unsignedBigInteger('client_id')->unsigned()->nullable();
//        $table->unsignedBigInteger('lead_id')->unsigned()->nullable();
//
//        $table->unsignedBigInteger('message_id')->unsigned()->nullable();
//        $table->unsignedBigInteger('response_id')->unsigned()->nullable();
//        return new ChatResource($this->storeModel(
//            new Chat(),
//            $request,
//            [
//                'client_id' => 'required|integer|exists:clients,id',
//                'lead_id' => 'required|integer|exists:leads,id',
//                'message_id' => 'sometimes|integer|exists:messages,id',
//                'response_id' => 'sometimes|integer|exists:responses,id',
//            ]
//        ));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Chat  $chat
     * @return ChatResource
     */
    public function show(Chat $chat)
    {
        return new ChatResource($chat);
    }

    public function selectChatByParticipants(Request $request)
    {
        $this->dataValidation($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'lead_id' => 'required|exists:leads,id',
        ]);

        return
            ChatResource::collection(Chat::forClient($request->query('client_id'))
                ->forLead($request->query('lead_id'))
//                ->text()
                ->get());
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Chat  $chat
     * @return ChatResource
     */
    public function update(Request $request, Chat $chat)
    {
        $role = $request->get('role') ?? null;
        $text = $request->get('text') ?? null;

        if (!$role)
        {
            $message = $request->get('message_id') ? Message::find($request->get('message_id')) : null;
            $response = $request->get('response_id') ? Response::find($request->get('response_id')) : null;

            if ($text)
            {
                if ($message) $message->text = $text;
                if ($response) $response->text = $text;
            }

            $chat->message()->save($message);
            $chat->response()->save($response);

            return new ChatResource($chat);
        }
        else
        {
            if (strtolower($role) === 'message')
            {
                $message = $request->get('message_id') ? Message::find($request->get('message_id')) : new Message();
                if ($text) $message->text = $text;
                $chat->message()->save($message);
                $chat->save();
                return new ChatResource($chat);
            }

            if (strtolower($role) === 'response')
            {
                $response = $request->get('response_id') ? Response::find($request->get('response_id')) : new Response();
                if ($text) $response->text = $text;
                $chat->response()->save($response);
                $chat->save();
                return new ChatResource($chat);
            }
        }

        return null;
//        protected $fillable = ['client_id', 'lead_id', 'message_id', 'response_id'];
    }

    public function change_message_status(Request $request)
    {
        $this->validate($request, [
            'message_id' => 'required|exists:messages,id',
            'approval_request' => 'required|in:PENDING,APPROVED,REJECTED,ALTERED'
        ]);

        $msg = Message::find($request->get('message_id'));
        $msg->approval_request = $request->get('approval_request');

        $msg->save();

        return new MessageResource($msg);
    }

    public function get_pending_ar()
    {

        $chats = Chat::with('client')
            ->with('lead')
            ->whereHas('message', function($query) {
                $query->where('approval_request', 'PENDING');
        })->get();

        return ChatResource::collection($chats);

//        $c_query = Chat::query();
//        $chats = $c_query->message()->where(function ($query) {
//            $query->where('message.approval_request', 'PENDING');
//        })->get();
//        $chats = Chat::where('message.approval_request', 'PENDING')->get();
//        $chats = Chat::where()
//        $pause = '';
//        $chats = Chat::where(function ($query) {
//            Chat::message->approval_request === 'PENDING';
//        });

//        return ChatResource::collection($chats);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Chat $chat
     * @return ChatResource
     * @throws \Exception
     */
    public function destroy(Chat $chat)
    {
        $chat->delete();
        return new ChatResource($chat);
    }
}
