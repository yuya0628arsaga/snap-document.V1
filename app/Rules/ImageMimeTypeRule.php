<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ImageMimeTypeRule implements ValidationRule
{
    /**
     * ファイルの拡張子をチェックする
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     *
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value !== 'png' && $value !== 'svg' && $value !== 'jpeg' && $value !== 'jpg') {
            $fail('拡張子が png, svg, jpeg, jpg のファイルを指定してください');
        }
    }
}
