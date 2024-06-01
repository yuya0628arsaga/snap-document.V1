<?php

declare(strict_types=1);

namespace Tests\Feature\Mock;

use App\Services\GptEngineConnection;
use App\Services\GptEngineConnectionInterface;
use Mockery as m;

/**
 * GptEngineConnectionをモック化
 */
class GptEngineConnectionMock
{
    /**
     * post
     *
     * @param array $responseFromGptEngine
     *
     * @return void
     */
    public function post(array $responseFromGptEngine): void
    {
        $gptEngineConnectionMock = m::mock(GptEngineConnection::class);
        $gptEngineConnectionMock->shouldReceive('post')
            ->andReturn($responseFromGptEngine);

        // 具象クラスの中身をmockにする
        app()->instance(GptEngineConnectionInterface::class, $gptEngineConnectionMock);
    }
}