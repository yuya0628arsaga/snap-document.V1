<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Chat\Params;

use Carbon\CarbonImmutable;

class StoreChatParams
{
    private readonly string $question;
    private readonly int $questionTokenCount;
    private readonly string $answer;
    private readonly int $answerTokenCount;
    private readonly CarbonImmutable $date;
    private readonly ?string $userId;
    private readonly string $documentId;

    /**
     * @param string $question
     * @param int $questionTokenCount
     * @param string $answer
     * @param int $answerTokenCount
     * @param CarbonImmutable $date
     * @param string $userId
     * @param string $documentId
     *
     * @return void
     */
    public function __construct(
        string $question,
        int $questionTokenCount,
        string $answer,
        int $answerTokenCount,
        CarbonImmutable $date,
        ?string $userId,
        string $documentId,
    ) {
        $this->question = $question;
        $this->questionTokenCount = $questionTokenCount;
        $this->answer = $answer;
        $this->answerTokenCount = $answerTokenCount;
        $this->date = $date;
        $this->userId = $userId;
        $this->documentId = $documentId;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'question' => $this->question,
            'question_token_count' => $this->questionTokenCount,
            'answer' => $this->answer,
            'answer_token_count' => $this->answerTokenCount,
            'date' => $this->date,
            'user_id' => $this->userId,
            'document_id' => $this->documentId,
        ];
    }
}