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
        Schema::create('chat_images', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment(__('chat_images.id'));
            $table->string('name', 255)->comment(__('chat_images.name'));
            $table->text('url')->comment(__('chat_images.url'));

            $table->foreignUlid('chat_id')->constrained('chats')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_images');
    }
};
