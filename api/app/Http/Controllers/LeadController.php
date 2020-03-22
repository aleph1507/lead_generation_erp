<?php

namespace App\Http\Controllers;

use App\Lead;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Traits\ValidateAndCreate;
use App\Http\Resources\LeadResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
{

    use ValidateAndCreate;

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        return LeadResource::collection(Lead::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return LeadResource
     */
    public function store(Request $request)
    {
        $r = $request->all();
        return new LeadResource($this->storeModel(
            new Lead(),
            $request,
            [
                'client_id' => 'sometimes|integer|exists:clients,id'
//                'name' => 'required|string|max:255',
//                'status' => 'sometimes|in:NOTCONTACTED,NEUTRAL,POSITIVE,NEGATIVE',
            ],
            [
                'attach' => $request->get('attach') ? json_decode($request->get('attach')) : null,
                'detach' => $request->get('detach') ? json_decode($request->get('detach')) : null
            ]
        ));
    }

    public function addCSVLeads(Request $request) {
        return LeadResource::collection($this->generateLeadsFromCSV($request->all()));
    }

    /**
     * Display the specified resource.
     *
     * @param Lead $lead
     * @return LeadResource
     */
    public function show(Lead $lead)
    {
        return new LeadResource($lead);
    }

    public function searchByText(Request $request)
    {
//        $leadQuery = Lead::query();

        $leads = Lead::query();

        $req_query = $request->get('query');

//        if ($client_id = $request->get('client'))
//        {
//            $leadQuery->whereHas('clients', function (Builder $query) use($client_id) {
//                $query->where('clients.id',$client_id);
//            })->get();
//        }

        if ($client_id = $request->get('client'))
        {
//            $leads = Lead::onlyTrashed();
            $leads = /*Lead::*/$leads->whereHas('clients', function ($q) use ($client_id, $req_query) {
                $q = $q->where('clients.id', $client_id);
//
//                if ($req_query) {
//                    $q = $q->where(function ($query) use ($req_query) {
//                        $query->where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%']])
//                            ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']]);
//                    })->orderBy('updated_at')->get();
//                }
//            });
                if (!$req_query)
                {
                    $q->where('clients.id', $client_id);
                }
                else
                {
                    $q->where('clients.id', $client_id)
                        ->where(function ($query) use ($req_query) {
                            $query->where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%']])
                                ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%']])
                                ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%']])
                                ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%']])
                                ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%']])
                                ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%']])
                                ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%']])
                                ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%']])
                                ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']]);
                        });
                }

            })->orderBy('updated_at')->get();

//            if ($req_query != '')
//            {
//                $leads->where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']])
//                    ->orderBy('updated_at')->get();
//            }

//            $leadQuery->with(['clients', $client_id])->orderBy('updated_at');
//            $leadQuery->with('clients.id', $client_id)->orWhere([
//                ['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%'],
//                ['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%'],
//                ['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%'],
//                ['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%'],
//                ['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%'],
//                ['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%'],
//                ['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%'],
//                ['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%'],
//                ['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']
//            ])->orderBy('updated_at');
//            $leadQuery->whereHas('clients', function (Builder $builder_query) use ($client_id) {
//                $builder_query->where('clients.id', $client_id);
//            })->where(function ($q) use ($req_query) {
//                $q->
////                where([
////
////                ])->
//                orWhere([
//                    ['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%'],
//                    ['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%'],
//                    ['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%'],
//                    ['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%'],
//                    ['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%'],
//                    ['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%'],
//                    ['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%'],
//                    ['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%'],
//                    ['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']
//                ]);
//            })->orderBy('updated_at');
        }
        else
        {
            if ($req_query != '')
            {
                $leads = Lead::where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%']])
                    ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%']])
                    ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%']])
                    ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%']])
                    ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%']])
                    ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%']])
                    ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%']])
                    ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%']])
                    ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']])
                    ->orderBy('updated_at')->get();
            }
        }


//        if ($client_id = $request->get('client'))
//        {
//            $leadQuery->whereHas('clients', function(Builder $builder_query) use ($client_id, $req_query, $leadQuery) {
//                $builder_query->where('clients.id', $client_id);
//                if ($req_query != '')
//                {
//                    $builder_query
//                        ->where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%']])
//                        ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']])
//                        ->orderBy('leads.updated_at');
//                }
//            });
//        }
//        else
//        {
//            if ($req_query != '')
//            {
//                $leadQuery->where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $req_query . '%']])
//                    ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $req_query . '%']])
//                    ->orderBy('updated_at');
//            }
//        }

//        if ($query != '')
//        {
//
//            $leadQuery->where([['duxid', '!=', null], ['duxid', '!=', ''], ['duxid', '!=', ' '], ['duxid', 'like', '%' . $query . '%']])
//                ->orWhere([['profile', '!=', null], ['profile', '!=', ''], ['profile', '!=', ' '], ['profile', 'like', '%' . $query . '%']])
//                ->orWhere([['degree', '!=', null], ['degree', '!=', ''], ['degree', '!=', ' '], ['degree', 'like', '%' . $query . '%']])
//                ->orWhere([['firstName', '!=', null], ['firstName', '!=', ''], ['firstName', '!=', ' '], ['firstName', 'like', '%' . $query . '%']])
//                ->orWhere([['middleName', '!=', null], ['middleName', '!=', ''], ['middleName', '!=', ' '], ['middleName', 'like', '%' . $query . '%']])
//                ->orWhere([['lastName', '!=', null], ['lastName', '!=', ''], ['lastName', '!=', ' '], ['lastName', 'like', '%' . $query . '%']])
////                ->orWhere('summary', 'like', '%' . $query . '%')
//                ->orWhere([['title', '!=', null], ['title', '!=', ''], ['title', '!=', ' '], ['title', 'like', '%' . $query . '%']])
//                ->orWhere([['company', '!=', null], ['company', '!=', ''], ['company', '!=', ' '], ['company', 'like', '%' . $query . '%']])
//                ->orWhere([['email', '!=', null], ['email', '!=', ''], ['email', '!=', ' '], ['email', 'like', '%' . $query . '%']])
////                ->orWhere('phone', 'like', '%' . $query . '%')
////                ->orWhere('IM', 'like', '%' . $query . '%')
////                ->orWhere('twitter', 'like', '%' . $query . '%')
////                ->orWhere('location', 'like', '%' . $query . '%')
////                ->orWhere('industry', 'like', '%' . $query . '%')
////                ->orWhere('myTags', 'like', '%' . $query . '%')
////                ->orWhere('myNotes', 'like', '%' . $query . '%')
//                ->orderBy('updated_at')->get();
//        }
//        else {
//////            $data = Lead::orderBy('updated_at')->get();
//            $leadQuery->orderBy('updated_at')->get();
//        }
//
//        if ($client_id = $request->get('client'))
//        {
//            $leadQuery->clients->contains($client_id);
////            $leadQuery->whereHas('clients', function (Builder $query) use($client_id) {
////                $query->where('clients.id',$client_id);
////            })->get();
//        }

//        return json_encode($data);

//        $sql = $leadQuery->toSql();
        return LeadResource::collection($leads);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Lead $lead
     *
     * @return LeadResource
     */
    public function update(Request $request, Lead $lead)
    {
        return new LeadResource($this->storeModel(
            $lead,
            $request,
            [
//                'name' => 'required|string|max:255',
//                'status' => 'sometimes|in:NOTCONTACTED,NEUTRAL,POSITIVE,NEGATIVE',
            ],
            [
                'attach' => $request->get('attach') ? json_decode($request->get('attach')) : null,
                'detach' => $request->get('detach') ? json_decode($request->get('detach')) : null
            ]
        ));
    }

    public function getTrashed()
    {
        return LeadResource::collection(Lead::onlyTrashed()->get());
    }

    public function restore(Request $request)
    {
//        $id = $request->get('id');
        $this->validate($request, [
            'id' => 'required|integer|exists:leads,id'
        ]);

        return json_encode(Lead::onlyTrashed()->find($request->get('id'))->restore());
//        $l = Lead::onlyTrashed()->find($id);
//        $r = Lead::find($request->get('id'))->restore();
////        $r = $lead->save();
//        return json_encode($r);
    }

    public function shred(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|integer|exists:leads,id'
        ]);

        return json_encode(Lead::onlyTrashed()->find($request->get('id'))->forceDelete());
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param Lead $lead
     * @return LeadResource
     * @throws \Exception
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();
        return new LeadResource($lead);
    }
}
