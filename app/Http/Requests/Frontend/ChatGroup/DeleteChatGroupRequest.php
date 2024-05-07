<?php

declare(strict_types=1);

namespace App\Http\Requests\Frontend\ChatGroup;

use Illuminate\Foundation\Http\FormRequest;

class DeleteChatGroupRequest extends FormRequest
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
            'chatGroupId' => ['required', 'string', 'exists:chat_groups,id,deleted_at,NULL'],
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'chatGroupId' => __('chat_groups.id'),
        ];
    }

    /**
     * チャットグループIDを取得
     *
     * @return string
     */
    public function getChatGroupId(): string
    {
        return $this->route('chat_group_id');
    }

    /**
     * @return void
     */
    public function prepareForValidation(): void
    {
        $this->merge(['chatGroupId' => $this->route('chat_group_id')]);
    }
}
