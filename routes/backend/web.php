<?php

declare(strict_types=1);

use App\Http\Controllers\Backend\Document\DocumentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Web Routes
|--------------------------------------------------------------------------
|
*/

Route::get('/document', DocumentController::class)->name('document');