<?php

use App\Http\Middleware\RoleAdmin;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'jwt.auth' => Authenticate::class, // Đăng ký middleware jwt.auth
            'role.admin' => RoleAdmin::class, // Đăng ký middleware role.admin
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
