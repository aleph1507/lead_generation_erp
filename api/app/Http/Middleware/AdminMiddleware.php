<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
//use Illuminate\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $u = auth('api')->user();
        if ($u && $u->is_admin())
        {
            return $next($request);
        }
        return response(['unauthorized' => 'administrator route'], 401);
    }
}
