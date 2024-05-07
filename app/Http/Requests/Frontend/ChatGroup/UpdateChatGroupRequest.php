<?php

declare(strict_types=1);

namespace App\Http\Requests\Frontend\ChatGroup;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChatGroupRequest extends FormRequest
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
            'chatGroupId' => ['required', 'string', 'exists:chat_groups,id'],
            'title' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'chatGroupId' => __('chat_groups.id'),
            'title' => __('chat_groups.title'),
        ];
    }

    /**
     * チャットグループIDを取得
     *
     * @return string
     */
    public function getChatGroupId(): string
    {
        return $this->input('chatGroupId');
    }

    /**
     * タイトルを取得
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->input('title');
    }
}
