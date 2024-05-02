<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Document;

use App\Models\Document;
use Illuminate\Support\Collection;

class DocumentRepositoryImpl implements DocumentRepository
{
    /**
     * {@inheritdoc}
     */
    public function firstOrFailByDocumentName(string $documentName): Document
    {
        return Document::where('name', '=', $documentName)->firstOrFail();
    }

    /**
     * {@inheritdoc}
     */
    public function fetchAll(): Collection
    {
        return Document::all();
    }
}
