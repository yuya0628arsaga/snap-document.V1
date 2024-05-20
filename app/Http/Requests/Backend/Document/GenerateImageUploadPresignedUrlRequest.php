<?php

declare(strict_types=1);

namespace App\Http\Requests\Backend\Document;

use App\Rules\ImageMimeTypeRule;
use Illuminate\Foundation\Http\FormRequest;

class GenerateImageUploadPresignedUrlRequest extends FormRequest
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
            'document_name' => ['required', 'string', 'exists:documents,name'],
            'file_name' => ['required', 'string'],
            'size' => ['required', 'integer', 'max:10485760'], // 単位はバイト（10MBまで許容）
            'extension' => ['required', new ImageMimeTypeRule()],
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'document_name' => __('documents.name'),
            'file_name' => __('chat_images.name'),
            'size' => __('chat_images.size'),
            'extension' => __('chat_images.extension'),
        ];
    }

    /**
     * ドキュメント名を取得
     *
     * @return string
     */
    public function getDocumentName(): string
    {
        return $this->input('document_name');
    }

    /**
     * ファイル名を取得
     *
     * @return string
     */
    public function getFileName(): string
    {
        return $this->input('file_name');
    }
}
