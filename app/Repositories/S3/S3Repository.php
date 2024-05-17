<?php

declare(strict_types=1);

namespace App\Repositories\S3;

use Illuminate\Http\UploadedFile;

interface S3Repository
{
    /**
     * S3へファイルをアップロード
     *
     * @param string $disk
     * @param string $path
     * @param string|UploadedFile $file
     *
     * @return bool|string
     */
    public function put(string $disk, string $path, string|UploadedFile $file): bool|string;

    /**
     * S3からファイルを取得
     *
     * @param string $disk
     * @param string $path
     *
     * @return string
     */
    public function get(string $disk, string $path): string;

    /**
     * S3からファイルを削除
     *
     * @param string $disk
     * @param string $path
     *
     * @return bool
     */
    public function delete(string $disk, string $path): bool;

    /**
     * S3にファイルをアップロードするための署名付きURLを発行
     *
     * @param string $disk
     * @param string $path
     *
     * @return string
     */
    public function generateUploadPresignedUrl(string $disk, string $path): string;
}
