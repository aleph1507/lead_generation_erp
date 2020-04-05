<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResponseResource;
use App\Response;
use Illuminate\Http\Request;
use App\Traits\ValidateAndCreate;
use Illuminate\Support\Facades\App;

class ResponseController extends Controller
{
    use ValidateAndCreate;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return ResponseResource::collection(Response::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return ResponseResource
     */
    public function store(Request $request)
    {
        return new ResponseResource($this->storeModel(
            new Response(),
            $request,
            [
                'text' => 'required|string',
                'message_id' => 'sometimes|exists:messages,id'
            ]
        ));
    }

    /**
     * Display the specified resource.
     *
     * @param Response $response
     * @return ResponseResource
     */
    public function show(Response $response)
    {
        return new ResponseResource($response);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param Response $response
     * @return ResponseResource
     */
    public function update(Request $request, Response $response)
    {
        return new ResponseResource($this->storeModel(
            $response,
            $request,
            [
                'text' => 'required|string',
                'message_id' => 'sometimes|exists:messages,id'
            ]
        ));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Response $response
     * @return Response
     * @throws \Exception
     */
    public function destroy(Response $response)
    {
        $response->delete();
        return $response;
    }
}
