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
        Schema::create('chat_groups', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment(__('chat_groups.id'));
            $table->string('title', 255)->comment(__('chat_groups.title'));
            $table->date('last_chat_date')->comment(__('chat_groups.last_chat_date'));

            $table->string('user_id', 26)->nullable()->comment(__('users.id')); # MEMO::未ログインUserによる質問も許容する予定のため一旦外部キー制約は貼らない

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_groups');
    }
};
