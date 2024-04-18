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
            $table->dateTime('date')->comment(__('chats.date'));
            $table->text('question')->comment(__('chats.question'));
            $table->text('answer')->comment(__('chats.answer'));
            $table->integer('question_token_count')->comment(__('chats.question_token_count'));
            $table->integer('answer_token_count')->comment(__('chats.answer_token_count'));
            $table->double('cost', 10, 7)->comment(__('chats.cost'));

            $table->string('user_id', 26)->nullable()->comment(__('users.id')); # MEMO::未ログインUserによる質問も許容する予定のため一旦外部キー制約は貼らない
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
