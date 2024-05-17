<?php

declare(strict_types=1);

namespace App\Repositories\S3;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class S3RepositoryImpl implements S3Repository
{
    /**
     * {@inheritDoc}
     */
    public function put(string $disk, string $path, string|UploadedFile $file): bool|string
    {
        return Storage::disk($disk)->put($path, $file);
    }

    /**
     * {@inheritDoc}
     */
    public function get(string $disk, string $path): string
    {
        if (! Storage::disk($disk)->exists($path)) {
            throw new \Exception("指定ファイルが見つからないためファイルの取得に失敗しました: path = {$path}");
        }

        return Storage::disk($disk)->get($path);
    }

    /**
     * {@inheritDoc}
     */
    public function delete(string $disk, string $path): bool
    {
        if (! Storage::disk($disk)->exists($path)) {
            throw new \Exception("指定ファイルが見つからないためファイルの削除に失敗しました: path = {$path}");
        }

        return Storage::disk($disk)->delete($path);
    }

    /**
     * {@inheritDoc}
     */
    public function generateUploadPresignedUrl(string $disk, string $path): string
    {
        Log::info('アップロード用署名付きurl発行処理を開始します。', [
            'method' => __METHOD__,
            'path' => $path,
        ]);

        // FIXME: 同名ファイルをアップロードできないよう一時的な措置
        if (Storage::disk($disk)->exists($path)) {
            Log::info('アップロード用署名付きurl発行処理に失敗しました。');
            throw ValidationException::withMessages(['file_name' => '同名のファイルが存在します']);
        }

        $client = Storage::disk($disk)->getClient();

        $command = $client->getCommand('PutObject', [
            'Bucket' => config('filesystems.disks.s3.bucket'),
            'Key' => $path,
        ]);
        $expire = now()->addSeconds(config('s3.presigned_url.expire'));

        $generatedUrl = $client->createPresignedRequest($command, $expire)
            ->getUri();

        Log::info('アップロード用署名付きurl発行処理が完了しました。', [
            'method' => __METHOD__,
            'path' => $path,
            'url' => $generatedUrl,
        ]);

        return (string) $generatedUrl;
    }
}
