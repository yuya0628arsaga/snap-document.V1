<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Document;

use App\Models\Document;
use Illuminate\Support\Collection;

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

    /**
     * 全てのドキュメントを取得
     *
     * @return Collection
     */
    public function fetchAll(): Collection;
}
