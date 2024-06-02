<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat\Api\Params;

class ChatParams
{
    /**
     * @param string $question
     * @param string $documentName
     * @param array $chatHistory
     * @param bool $isGetPdfPage
     * @param string $gptModel
     *
     * @return void
     */
    public function __construct(
        private readonly string $question,
        private readonly string $documentName,
        private readonly array $chatHistory,
        private readonly bool $isGetPdfPage,
        private readonly string $gptModel,
    ) {
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'question' => $this->question,
            'document_name' => $this->documentName,
            'chat_history' => $this->chatHistory,
            'is_get_pdf_page' => $this->isGetPdfPage,
            'gpt_model' => $this->gptModel,
        ];
    }

    /**
     * 質問を取得
     *
     * @return string
     */
    public function getQuestion(): string
    {
        return $this->question;
    }

    /**
     * ドキュメント名を取得
     *
     * @return string
     */
    public function getDocumentName(): string
    {
        return $this->documentName;
    }
}