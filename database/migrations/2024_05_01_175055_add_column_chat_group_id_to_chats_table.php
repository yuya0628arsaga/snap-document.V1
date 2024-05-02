<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->foreignUlid('chat_group_id')
                ->constrained('chat_groups')
                ->cascadeOnDelete()
                ->after('document_id')
                ->comment(__('chat_groups.id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->dropForeign(['chat_group_id']);
            $table->dropColumn('chat_group_id');
        });
    }
};
