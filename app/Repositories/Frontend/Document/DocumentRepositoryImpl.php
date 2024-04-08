<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Document;

use App\Models\Document;

class DocumentRepositoryImpl implements DocumentRepository
{
    /**
     * {@inheritdoc}
     */
    public function firstOrFailByDocumentName(string $documentName): Document
    {
        return Document::where('name', '=', $documentName)->firstOrFail();
    }
}
