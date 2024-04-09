<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Document;

use App\Models\Document;

interface DocumentRepository
{
    /**
     * ドキュメント名からdocumentを取得
     *
     * @param string $documentName
     *
     * @return Document
     */
    public function firstOrFailByDocumentName(string $documentName): Document;
}
