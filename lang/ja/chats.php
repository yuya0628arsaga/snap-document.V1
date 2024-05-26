<?php

declare(strict_types=1);

$tableLabel = 'チャット';

return [
    'table_description' => "${tableLabel}テーブル",
    'id' => "${tableLabel}ID",
    'date' => '質問日',
    'question' => '質問',
    'answer' => '回答',
    'question_token_count' => '質問のトークン数',
    'answer_token_count' => '回答のトークン数',
    'document_id' => 'ドキュメントID',
    'user_id' => 'ユーザーID',
    'page_id' => 'ページID',
    'cost' => 'GPTの料金',

    'history' => 'チャット履歴',
    'is_get_pdf_page' => 'PDFページ取得フラグ',
    'gpt_model' => 'GPTモデル',
];

