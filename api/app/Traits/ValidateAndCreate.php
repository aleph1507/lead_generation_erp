<?php

namespace App\Traits;
use App\Client;
use App\Lead;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

trait ValidateAndCreate
{
//    public function validateRequest(Request $request, Array $requestRules)
//    {
//        $r = $request->all();
//        $validator = Validator::make($request->all(), $requestRules);
//        if ($validator->fails())
//        {
//            return json_encode(['errors'=>$validator->errors()->all()]);
//        }
//
//        return true;
//    }

    public function modelCreation(Model $model, $data) {

    }

//    public function requestValidation(Request $request, $requestRules = null) {
//        if ($request && $requestRules)
//        {
//            if (($validation = $this->validateRequest($request, $requestRules)) !== true)
//            {
//                echo $validation;
//                die();
//            }
//        }
//    }

    public function dataValidation ($data, $validationRules = []) {
        $validator = Validator::make($data, $validationRules);
        if ($validator->fails())
        {
            echo json_encode(['errors'=>$validator->errors()->all()]);
            die();
        }

        return true;
    }

    public function storeModel(Model $model, $data = null, Array $requestRules = null,
        Array $mnRelationships = [])
    {
        $result = null;
        if ($data instanceof Request) {
            $data = $data->all();
        }

        $this->dataValidation($data, $requestRules);

        if (!$model->exists)
        {
            $result = $model = $model::create($data);
        }

        if (isset($mnRelationships['attach']))
        {
            foreach ($mnRelationships['attach'] as $relation => $ids)
            {
                if (is_array($ids) && !in_array(null, $ids))
                {
                    $model->$relation()->syncWithoutDetaching($ids);
                }
            }
        }

        if (isset($mnRelationships['detach']))
        {
            foreach ($mnRelationships['detach'] as $relation => $ids)
            {
                if (is_array($ids))
                {
                    foreach ($ids as $id)
                    {
                        $model->$relation()->detach($id);
                    }
                }
            }
        }

        if ($result === null)
        {
            $result = $model->update($data);
        }
        else
        {
            $model->update($data);
        }

        if ($model instanceof Client && isset($data['csv_file'])) {
            $data['client_id'] = $model->id;
            $this->generateLeadsFromCSV($data);
        }

        return $result;
//        return is_bool($result) ? ['success' => $result] : $result;
    }

    public function generateLeadsFromCSV($data) {
        $validationRules = [
            'csv_file' => 'required|file|mimes:csv,txt',
            'client_id' => 'sometimes|integer|exists:clients,id'
        ];

        $this->dataValidation($data, $validationRules);

        $leads = new Collection();
        $mnRelationships = [];
        $client_id = $data['client_id'] ? (int)$data['client_id'] : null;
        if ($client_id) {
            $mnRelationships['attach']['clients'] = [$client_id];
        }

        $fields = ['duxid', 'visitTime', 'profile',
            'picture', 'degree', 'firstName',
            'middleName', 'lastName', 'summary',
            'title', 'from', 'company',
            'companyProfile', 'companyWebsite', 'personalWebsite',
            'email', 'phone', 'IM',
            'twitter', 'location', 'industry',
            'myTags', 'myNotes'];

        $path = $data['csv_file']->getRealPath();
        $data = array_map('str_getcsv', file($path));

        for ($i = 1; $i < count($data); $i++) {
            $newLeadData = [];
            $prospect = $data[$i];
            for ($j = 0; ($j < count($prospect)) && ($j < count($fields)); $j++) {
                if ($prospect[$j] == "" || !isset($prospect[$j])) {
                    $newLeadData[$fields[$j]] = null;
                } else {
                    $pfield = $prospect[$j];
                    $newLeadData[$fields[$j]] = $pfield;
                }
            }
            $lead = count($mnRelationships) > 0 ? $this->storeModel(new Lead(), $newLeadData, [], $mnRelationships) :
                $this->storeModel(new Lead(), $newLeadData);
            $leads->push($lead);
        }

        return $leads;
    }
}
