<?php

declare(strict_types=1);

namespace App\Http\Requests\Frontend\Chats;

use App\Http\Controllers\Frontend\Chat\Api\Params\ChatParams;
use App\Rules\StoreChatRule;
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
            'chatGroupId' => [new StoreChatRule()],
            'isGetPdfPage' => ['required', 'boolean'],
            'gptModel' => ['required', 'string'],
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
            'chatGroupId' => __('chat_groups.id'),
            'isGetPdfPage' => __('chats.is_get_pdf_page'),
            'gptModel' => __('chats.gpt_model'),
        ];
    }

    /**
     * 質問を取得
     *
     * @return string
     */
    private function getQuestion(): string
    {
        return $this->input('question');
    }

    /**
     * マニュアル名を取得
     *
     * @return string
     */
    private function getManualName(): string
    {
        return $this->input('manualName');
    }

    /**
     * チャット履歴を取得
     *
     * @return array
     */
    private function getChatHistory(): array
    {
        return $this->input('chatHistory');
    }

    /**
     * チャットグループIDを取得
     *
     * @return ?string
     */
    public function getChatGroupId(): string | null
    {
        return $this->input('chatGroupId');
    }

    /**
     * PDFページの取得フラグを取得
     *
     * @return bool
     */
    private function getIsGetPdfPage(): bool
    {
        return $this->input('isGetPdfPage');
    }

    /**
     * 使用するGPTモデルを取得
     *
     * @return string
     */
    private function getGptModel(): string
    {
        return $this->input('gptModel');
    }

    /**
     *
     * @return ChatParams
     */
    public function getChatParams(): ChatParams
    {
        return new ChatParams(
            question: $this->getQuestion(),
            documentName: $this->getManualName(),
            chatHistory: $this->getChatHistory(),
            isGetPdfPage: $this->getIsGetPdfPage(),
            gptModel: $this->getGptModel(),
        );
    }
}
