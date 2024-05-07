<?php

declare(strict_types=1);

namespace App\Rules;

use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StoreChatRule implements ValidationRule
{
    /**
     * チャットグループIDがnullでない場合に、そのIDが存在するかチェックする
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value) return;

        $isExists = (app()->make(ChatGroupRepository::class))->exists($value);
        if (! $isExists) $fail('指定したチャットグループIDは存在しません。');
    }
}
