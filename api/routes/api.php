<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::resource('/clients', 'ClientController');
//Route::get('/clients', 'ClientController@index');
//Route::get('/clients/trashed', 'ClientController@getTrashed');
//Route::post('/clients/restore', 'ClientController@restore');
//Route::post('/clients/shred', 'ClientController@shred');
//Route::get('/clients/leads/{client}', 'ClientController@getLeadsForClient');
//Route::get('/clients/leads/date/{client}', 'ClientController@getLeadsByDate');
//Route::post('/clients/search', 'ClientController@searchByText');
//Route::get('/clients/{client}', 'ClientController@show');
//Route::post('/clients', 'ClientController@store');
////Route::put('/clients/{client}', 'ClientController@update');
//Route::post('/clients/update/{client}', 'ClientController@update');
//Route::delete('/clients/{client}', 'ClientController@destroy');
//
//
////Route::resource('/leads', 'LeadController');
//Route::get('/leads', 'LeadController@index');
//Route::post('/leads/csv', 'LeadController@addCSVLeads');
//Route::post('/leads/restore', 'LeadController@restore');
//Route::post('/leads/shred', 'LeadController@shred');
//Route::post('/leads/search', 'LeadController@searchByText');
//Route::get('/leads/trashed', 'LeadController@getTrashed');
//Route::get('/leads/{lead}', 'LeadController@show');
//Route::post('/leads', 'LeadController@store');
//Route::post('/leads/csv', 'LeadController@addCSVLeads');
////Route::put('/leads/{lead}', 'LeadController@update');
//Route::post('/leads/update/{lead}', 'LeadController@update');
//Route::delete('/leads/{lead}', 'LeadController@destroy');
//
//Route::get('/chats', 'ChatController@index');
//Route::get('/chats/participants', 'ChatController@selectChatByParticipants');
//Route::post('/chats/change-message-status', 'ChatController@change_message_status');
//Route::get('/chats/get-pending-ar', 'ChatController@get_pending_ar');
//Route::get('/chats/{chat}', 'ChatController@show');
//Route::post('/chats', 'ChatController@store');
////Route::put('/chats/{chat}', 'ChatController@update');
//Route::post('/chats/update/{chat}', 'ChatController@update');
//Route::delete('/chats/{chat}', 'ChatController@destroy');
//
////Route::resource('/message', 'MessageController');
//Route::get('/messages', 'MessageController@index');
//Route::get('/messages/{message}', 'MessageController@show');
//Route::post('/messages', 'MessageController@store');
////Route::put('/messages/{message}', 'MessageController@update');
//Route::post('/messages/update/{message}', 'MessageController@update');
//Route::delete('/messages/{message}', 'MessageController@destroy');
//
////Route::resource('/responses', 'ResponseController');
//Route::get('/responses', 'ResponseController@index');
//Route::get('/responses/{response}', 'ResponseController@show');
//Route::post('/responses', 'ResponseController@store');
////Route::put('/responses/{response}', 'ResponseController@update');
//Route::post('/responses/update/{response}', 'ResponseController@update');
//Route::delete('/responses/{response}', 'ResponseController@destroy');

//Route::middleware('auth:api')->get('/user', function (Request $request) {
////    return $request->user();
//});

//Route::post('/register', 'Auth\RegisterController@register');
Route::post('/register_first', 'Auth\AuthController@register_first')->name('register_first');
//Route::post('/login', 'Auth\LoginController@login');
Route::post('/login', 'Auth\AuthController@login')->name('login');

Route::middleware(['AdminMiddleware'])->group(function() {
    Route::get('/chats/get-pending-ar', 'ChatController@get_pending_ar');
    Route::get('/clients/trashed', 'ClientController@getTrashed');
    Route::post('/clients/restore', 'ClientController@restore');
    Route::post('/clients/shred', 'ClientController@shred');
    Route::post('/leads/restore', 'LeadController@restore');
    Route::post('/leads/shred', 'LeadController@shred');
    Route::get('/leads/trashed', 'LeadController@getTrashed');
    Route::get('/users', 'Auth\AuthController@get_users')->name('user.index');
    Route::post('/user/{user}', 'Auth\AuthController@edit_user')->name('user.edit');
    Route::post('/user/delete/{user}', 'Auth\AuthController@delete_user')->name('user.delete');
    Route::post('/user/shred', 'Auth\AuthController@shred_user')->name('user.shred');
    Route::post('/user/restore', 'Auth\AuthController@restore_user')->name('user.shred');
});

Route::middleware(['auth:api'])->group(function() {
    Route::get('/clients', 'ClientController@index');
//    Route::get('/clients/trashed', 'ClientController@getTrashed');
//    Route::post('/clients/restore', 'ClientController@restore');
//    Route::post('/clients/shred', 'ClientController@shred');
    Route::get('/clients/leads/{client}', 'ClientController@getLeadsForClient');
    Route::get('/clients/leads/date/{client}', 'ClientController@getLeadsByDate');
    Route::post('/clients/search', 'ClientController@searchByText');
    Route::get('/clients/{client}', 'ClientController@show');
    Route::post('/clients', 'ClientController@store');
    Route::post('/clients/update/{client}', 'ClientController@update');
    Route::delete('/clients/{client}', 'ClientController@destroy');

    Route::get('/leads', 'LeadController@index');
    Route::post('/leads/csv', 'LeadController@addCSVLeads');
//    Route::post('/leads/restore', 'LeadController@restore');
//    Route::post('/leads/shred', 'LeadController@shred');
    Route::post('/leads/search', 'LeadController@searchByText');
//    Route::get('/leads/trashed', 'LeadController@getTrashed');
    Route::get('/leads/{lead}', 'LeadController@show');
    Route::post('/leads', 'LeadController@store');
    Route::post('/leads/csv', 'LeadController@addCSVLeads');
    Route::post('/leads/update/{lead}', 'LeadController@update');
    Route::delete('/leads/{lead}', 'LeadController@destroy');

    Route::get('/chats', 'ChatController@index');
    Route::get('/chats/participants', 'ChatController@selectChatByParticipants');
    Route::post('/chats/change-message-status', 'ChatController@change_message_status');
//    Route::get('/chats/get-pending-ar', 'ChatController@get_pending_ar');
    Route::get('/chats/{chat}', 'ChatController@show');
    Route::post('/chats', 'ChatController@store');
    Route::post('/chats/update/{chat}', 'ChatController@update');
    Route::delete('/chats/{chat}', 'ChatController@destroy');

    Route::get('/messages', 'MessageController@index');
    Route::get('/messages/{message}', 'MessageController@show');
    Route::post('/messages', 'MessageController@store');
    Route::post('/messages/update/{message}', 'MessageController@update');
    Route::delete('/messages/{message}', 'MessageController@destroy');

    Route::get('/responses', 'ResponseController@index');
    Route::get('/responses/{response}', 'ResponseController@show');
    Route::post('/responses', 'ResponseController@store');
    Route::post('/responses/update/{response}', 'ResponseController@update');
    Route::delete('/responses/{response}', 'ResponseController@destroy');
    Route::post('/register', 'Auth\AuthController@register')->name('register');
    Route::post('/change_password', 'Auth\AuthController@change_password')->name('change_password');
    Route::get('/user/{user}', 'Auth\AuthController@get_user')->name('user.get');
    //    user: this.serverUrl + 'api/user',
    //    getUserAPI(id: number): Observable<User> {
//        return this.http.get<User>(this.serverConfigService.endpoints.user);
//  }


});

Route::fallback(function(){
    return response()->json([
        'message' => 'Page Not Found. If error persists, contact xrristo@gmail.com'], 404);
});
