<?php

return [
    'gpt_engine' => [
        // dev などでは http://sample-restapi.ecs.internal:8000 に対して、ローカルでは、http://gpt_engine:8000 に対して通信を行う
        'endpoint' => env('GPT_ENGINE_ENDPOINT', 'http://gpt_engine:8000'),
    ],
];
