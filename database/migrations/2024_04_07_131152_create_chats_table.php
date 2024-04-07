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
        Schema::create('chats', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment(__('chats.id'));
            $table->text('question')->comment(__('chats.question'));
            $table->integer('question_token_count')->nullable()->default(0)->comment(__('chats.question_token_count'));
            $table->text('answer')->comment(__('chats.answer'));
            $table->integer('answer_token_count')->nullable()->default(0)->comment(__('chats.answer_token_count'));
            $table->dateTime('date')->comment(__('chats.date'));

            $table->string('user_id', 26)->nullable()->comment(__('users.id')); # MEMO::未ログインUserによる質問も許容するため一旦外部キー制約は貼らない
            $table->foreignUlid('document_id')->constrained('documents')->comment(__('documents.id'));
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
