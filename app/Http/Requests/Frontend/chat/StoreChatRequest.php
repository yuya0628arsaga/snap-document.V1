<?php

declare(strict_types=1);

namespace App\Http\Requests\Frontend\Chat;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatRequest extends FormRequest
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
            'question' => ['required', 'string'], // TODO::質問のMaxトークン数のバリデーションを決める必要あり
            'manualName' => ['required', 'string', 'exists:documents,name'],
            'chatHistory' => ['array'],
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'question' => __('chats.question'),
            'manualName' => __('documents.name'),
            'chatHistory' => __('chats.history'),
        ];
    }

    /**
     * 質問を取得
     *
     * @return string
     */
    public function getQuestion(): string
    {
        return $this->input('question');
    }

    /**
     * マニュアル名を取得
     *
     * @return string
     */
    public function getManualName(): string
    {
        return $this->input('manualName');
    }

    /**
     * チャット履歴を取得
     *
     * @return array
     */
    public function getChatHistory(): array
    {
        return $this->input('chatHistory');
    }
}
