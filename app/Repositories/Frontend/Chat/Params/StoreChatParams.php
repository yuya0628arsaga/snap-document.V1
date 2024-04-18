<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Chat\Params;

use Carbon\CarbonImmutable;

class StoreChatParams
{
    private readonly CarbonImmutable $date;
    private readonly string $question;
    private readonly string $answer;
    private readonly int $questionTokenCount;
    private readonly int $answerTokenCount;
    private readonly ?string $userId;
    private readonly string $documentId;

    /**
     * @param CarbonImmutable $date
     * @param string $question
     * @param string $answer
     * @param int $questionTokenCount
     * @param int $answerTokenCount
     * @param string $userId
     * @param string $documentId
     *
     * @return void
     */
    public function __construct(
        CarbonImmutable $date,
        string $question,
        string $answer,
        int $questionTokenCount,
        int $answerTokenCount,
        ?string $userId,
        string $documentId,
    ) {
        $this->date = $date;
        $this->question = $question;
        $this->answer = $answer;
        $this->questionTokenCount = $questionTokenCount;
        $this->answerTokenCount = $answerTokenCount;
        $this->userId = $userId;
        $this->documentId = $documentId;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'date' => $this->date,
            'question' => $this->question,
            'answer' => $this->answer,
            'question_token_count' => $this->questionTokenCount,
            'answer_token_count' => $this->answerTokenCount,
            'user_id' => $this->userId,
            'document_id' => $this->documentId,
        ];
    }
}