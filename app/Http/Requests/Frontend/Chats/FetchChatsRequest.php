<?php

declare(strict_types=1);

namespace App\Http\Requests\Frontend\Chats;

use Illuminate\Foundation\Http\FormRequest;

class FetchChatsRequest extends FormRequest
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
            'chat_group_id' => ['required', 'string', 'exists:chat_groups,id'],
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'chat_group_id' => __('chat_groups.id'),
        ];
    }

    /**
     * チャットグループIDを取得
     *
     * @return string
     */
    public function getChatGroupId(): string
    {
        return $this->query('chat_group_id');
    }

    /**
     * @return void
     */
    public function prepareForValidation(): void
    {
        $this->merge(['chat_group_id' => $this->query('chat_group_id')]);
    }
}
