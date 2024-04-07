<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            /* backend */
            $this->backendRoutes();
            $this->apiV1BackendRoutes();

            /* frontend */
            $this->frontendRoutes();
            $this->apiV1FrontendRoutes();

            /* default */
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * @return void
     */
    protected function backendRoutes(): void
    {
        Route::domain(config('domain.admin_host'))
            ->middleware('web')
            ->as('admin.')
            ->group(base_path('routes/backend/web.php'));
    }

    /**
     * @return void
     */
    protected function apiV1BackendRoutes(): void
    {
        Route::domain(config('domain.admin_host'))
            ->prefix('api/v1')
            ->middleware('api')
            ->as('api.admin.')
            ->group(base_path('routes/backend/api.php'));
    }

    /**
     * @return void
     */
    protected function frontendRoutes(): void
    {
        Route::domain(config('domain.user_host'))
            ->middleware('web')
            ->as('user.')
            ->group(base_path('routes/frontend/web.php'));
    }

    /**
     * @return void
     */
    protected function apiV1FrontendRoutes(): void
    {
        Route::domain(config('domain.user_host'))
            ->prefix('api/v1')
            ->middleware('api')
            ->as('api.user.')
            ->group(base_path('routes/frontend/api.php'));
    }
}
