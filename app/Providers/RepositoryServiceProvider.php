<?php

namespace App\Providers;

use App\Repositories\Frontend\Chat\ChatRepository;
use App\Repositories\Frontend\Chat\ChatRepositoryImpl;
use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use App\Repositories\Frontend\ChatGroup\ChatGroupRepositoryImpl;
use App\Repositories\Frontend\ChatImage\ChatImageRepository;
use App\Repositories\Frontend\ChatImage\ChatImageRepositoryImpl;
use App\Repositories\Frontend\Document\DocumentRepository;
use App\Repositories\Frontend\Document\DocumentRepositoryImpl;
use App\Repositories\Frontend\Page\PageRepository;
use App\Repositories\Frontend\Page\PageRepositoryImpl;
use App\Repositories\Frontend\User\UserRepository;
use App\Repositories\Frontend\User\UserRepositoryImpl;
use App\Repositories\S3\S3Repository;
use App\Repositories\S3\S3RepositoryImpl;
use App\Services\GptEngineConnection;
use App\Services\GptEngineConnectionInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // backend

        // frontend
        $this->app->bind(ChatRepository::class, ChatRepositoryImpl::class);
        $this->app->bind(ChatGroupRepository::class, ChatGroupRepositoryImpl::class);
        $this->app->bind(DocumentRepository::class, DocumentRepositoryImpl::class);
        $this->app->bind(PageRepository::class, PageRepositoryImpl::class);
        $this->app->bind(ChatImageRepository::class, ChatImageRepositoryImpl::class);
        $this->app->bind(UserRepository::class, UserRepositoryImpl::class);

        // general
        $this->app->bind(S3Repository::class, S3RepositoryImpl::class);
        $this->app->bind(GptEngineConnectionInterface::class, GptEngineConnection::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
