<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Traits\ValidateAndCreate;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ValidateAndCreate;

   public function register(Request $request)
   {
       $validatedData = $request->validate([
           'name' => 'required|max:55',
           'email' => 'email|required|unique:users',
           'password' => 'required',
           'admin' => 'sometimes|in:0,1'
       ]);

       $validatedData['password'] = bcrypt($validatedData['password']);

       $user = User::create($validatedData);

       $accessToken = $user->createToken('authToken')->accessToken;

       return response(['user' => $user, 'accessToken' => $accessToken]);
   }


   public function register_first(Request $request)
   {
       if ($request->get('init_reg'))
       {
           return response(['init_reg' => User::count() === 0]);
       }

       if (User::count() > 0)
       {
           return response('error', 418);
       }

       if (!$request->get('admin'))
       {
           $request->merge(['admin' => false]);
       }

       return $this->register($request);
   }

   public function login(Request $request)
   {
       $loginData = $request->validate([
           'email' => 'email|required',
           'password' => 'required'
       ]);

       if (!auth()->attempt($loginData))
       {
           return response(['message' => 'Invalid credentials'], 401);
       }

       $accessToken = auth()->user()->createToken('authToken')->accessToken;

       return response(['user' => auth()->user(), 'accessToken' => $accessToken]);
   }

   public function change_password(Request $request)
   {
       $logged_in = auth()->user();
       $r = $request->all();
       $validation_rules = ['userId' => 'required|integer|exists:users,id', 'newPassword' => 'required|min:8'];
       if (!$logged_in->is_admin())
       {
           $validation_rules['oldPassword'] = 'required';
       }

       $data = $request->validate($validation_rules);

       $id = (int)$request->get('userId');

       if (!$logged_in->is_admin())
       {
           if ($id !== $logged_in->id || !Hash::check($data['oldPassword'], $logged_in->getAuthPassword()))
           {
               return response('Unauthorized', 403);
           }
           $logged_in->password = Hash::make($data['newPassword']);
           return (string)$logged_in->save();
       }
       else
       {
           $user = User::find($id);
           $user->password = bcrypt($request->get('newPassword'));
           return (string)$user->save();
       }
   }

   public function get_user(User $user)
   {
       return new UserResource($user);
   }

   public function get_users(Request $request)
   {
       $this->validate($request, [
           'trashed' => 'sometimes|in:true,false'
       ]);
       $trashed = $request->input('trashed') === 'true';
       if ($trashed)
       {
           return UserResource::collection(User::onlyTrashed()->get());
       }
       else
       {
           return UserResource::collection(User::orderBy('updated_at')->get());
       }
   }

   public function edit_user(Request $request, User $user)
   {
       if (!$user)
       {
           return;
       }
       $validated = $this->validate($request, [
           'name' => 'required',
           'email' => 'required|unique:users,email,'.$user->id,
           'password' => 'sometimes|min:8',
           'admin' => 'sometimes|in:0,1'
       ]);

       $user->update($validated);

       return new UserResource($user);
   }

   public function delete_user(User $user)
   {
       if ($user)
       {
           if ($user->id === auth()->user()->id)
           {
               return response(['message' => 'Cannot delete yourself'], 418);
           }
           $user->delete();
           return new UserResource($user);
       }

       return null;
   }

    public function shred_user(Request $request)
    {
        $id = $this->validate($request, [
            'id' => 'required|integer'
        ]);
        $user = User::onlyTrashed()->where('id', $id);
        if ($user)
        {
            $user->forceDelete();
            return json_encode($user);
        }

        return null;
    }

    public function restore_user(Request $request)
    {
        $id = $this->validate($request, [
            'id' => 'required|integer'
        ]);
        $user = User::onlyTrashed()->where('id', $id);
        if ($user)
        {
            $user->restore();
            return json_encode($user);
        }

        return null;
    }
}
