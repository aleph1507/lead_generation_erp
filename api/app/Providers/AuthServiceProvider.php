<?php

namespace App\Providers;

use App\Client;
use App\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
         'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

//        Gate::define('admin-ability', function ($user) {
//            return $user->is_admin;
//        });

        Gate::define('can-message', function(User $user, Client $client) {
            $isa = $user->is_admin();
            $cu = $client->user;
            if ($cu)
            {
                $cuid = $client->user->id;
            }
            return $user->is_admin() || ($client->user && $client->user->id === $user->id);
        });

        Passport::routes();

        //
    }
}
