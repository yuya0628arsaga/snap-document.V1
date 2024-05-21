<?php

declare(strict_types=1);

namespace App\Http\Controllers\Backend\Document;

use App\Http\Controllers\Controller;
use Illuminate\View\View;

class DocumentController extends Controller
{
    /**
     *
     * @return View
     */
    public function __invoke(): View
    {
        return view('backend.document.index');
    }
}