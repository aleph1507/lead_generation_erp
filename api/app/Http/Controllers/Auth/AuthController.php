<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
   public function register(Request $request)
   {
       $r = $request->all();
       $validatedData = $request->validate([
           'name' => 'required|max:55',
           'email' => 'email|required|unique:users',
           'password' => 'required',
           'admin' => 'sometimes|in:0,1'
       ]);

       $validatedData['password'] = bcrypt($validatedData['password']);

       $user = User::create($validatedData);

       $accessToken = $user->createToken('authToken')->accessToken;

       return response(['user'=>$user, 'accessToken' => $accessToken]);
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
}
