<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = ['Man_Digest_v9', 'PCBmanualV5', 'PCBmanual3DV5'];
        foreach ($documents as $document) {
            Document::factory([
                'name' => $document
            ])->create();
        }
    }
}
