<?php

namespace App\Http\Controllers;

use App\Client;
use App\Http\Resources\LeadResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Http\Resources\ClientResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;
use App\Traits\ValidateAndCreate;

class ClientController extends Controller
{

    use ValidateAndCreate;

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        $clients = Client::all();
        return ClientResource::collection(Client::all());
    }

    public function getLeadsForClient(Client $client) {
        return LeadResource::collection($client->leads);
    }

    public function getLeadsByDate(Client $client)
    {
//        return $client->leads;
        return $client->leads->groupBy(function($item){
            return $item->created_at->format('Y-m-d');
//            return $item->pivot->created_at->format('Y-m-d');
        })->reverse();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return ClientResource
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        return new ClientResource($this->storeModel(
            new Client(),
            $request,
            [
                'name' => 'required|string|max:255',
                'description' => 'sometimes',
                'csv_file' => 'sometimes|file|mimes:csv,txt',
            ]
        ));
    }

    /**
     * Display the specified resource.
     *
     * @param Client $client
     * @return ClientResource
     */
    public function show(Client $client)
    {
        return new ClientResource($client);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Client $client
     * @return ClientResource
     */
    public function update(Request $request, Client $client)
    {
        return new ClientResource($this->storeModel(
            $client,
            $request,
            [
                'name' => 'required|string|max:255',
                'description' => 'sometimes'
            ]
        ));
    }

    /**
     * Live search Client
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function searchByText(Request $request) {

        $query = $request->get('query');
//        $clients = Client::orderBy('updated_at');
        $clients = Client::query();
//        if ($lead_id = $request->get('lead'))
//        {
//            $clients = $clients->whereHas('leads', function (Builder $query) use ($lead_id){
//                $query->where('leads.id', $lead_id);
//            });
//        }

        if ($query != '') {
            $clients->where('name', 'like', '%' . $query . '%')
                    ->orWhere('description', 'like', '%' . $query . '%');
//                    ->orderBy('updated_at')->get();
        }
//        else {
//            $data = Client::orderBy('updated_at')->get();
//        }

        return ClientResource::collection($clients->get());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Client $client
     * @return ClientResource
     * @throws \Exception
     */
    public function destroy(Client $client)
    {
        $client->delete();
        return new ClientResource($client);
    }

    public function getTrashed()
    {
        return ClientResource::collection(Client::onlyTrashed()->get());
    }

    public function restore(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|integer|exists:clients,id'
        ]);

        return json_encode(Client::onlyTrashed()->find($request->get('id'))->restore());
    }

    public function shred(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|integer|exists:clients,id'
        ]);

        return json_encode(Client::onlyTrashed()->find($request->get('id'))->forceDelete());
    }
}
