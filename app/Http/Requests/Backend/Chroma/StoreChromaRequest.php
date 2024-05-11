<?php

declare(strict_types=1);

namespace App\Http\Requests\Backend\Chroma;

use Illuminate\Foundation\Http\FormRequest;

class StoreChromaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'documentName' => ['required', 'string'],
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'documentName' => __('documents.name'),
        ];
    }

    /**
     * ドキュメント名を取得
     *
     * @return string
     */
    public function getDocumentName(): string
    {
        return $this->input('documentName');
    }
}
