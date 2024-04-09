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
        Schema::create('users', function (Blueprint $table) {
            $table->ulid()->primary()->comment(__('users.id'));
            $table->string('nickname')->nullable()->comment(__('users.nickname'));
            $table->string('email')->unique()->comment(__('users.email'));
            $table->timestamp('email_verified_at')->nullable()->comment(__('users.email_verified_at'));
            $table->string('password')->comment(__('users.password'));
            $table->rememberToken();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
