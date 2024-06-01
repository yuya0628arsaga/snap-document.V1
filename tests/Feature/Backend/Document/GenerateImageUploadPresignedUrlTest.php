<?php

namespace Tests\Feature\Backend\Document;

use App\Models\Document;
use App\Repositories\S3\S3Repository;
use App\Repositories\S3\S3RepositoryImpl;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;
use Mockery as m;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class GenerateImageUploadPresignedUrlTest extends TestCase
{
    use RefreshDatabase;

    /** @var Document */
    private Document $document;

    /** @var string */
    private string $presignedUrl = 'https://presigned_url_test';

    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->setS3Mock();
        $this->document = Document::factory()->create();
    }

    /**
     * 正常系 - presignedUrlが返ってくる
     */
    public function test_generate_image_upload_presigned_url(): void
    {
        $requestParams = $this->makeRequestParams();
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_OK)
            ->assertJsonFragment([
                $this->presignedUrl
            ]);
    }

    /**
     * 異常系 - 存在しないドキュメントを指定した場合422エラーが出る
     */
    public function test_generate_image_upload_presigned_url_when_document_not_exist(): void
    {
        $requestParams = $this->makeRequestParams(documentName: 'wrong-document-name');
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * 異常系 - サイズが一定数を超えた場合422エラーが出る
     */
    public function test_generate_image_upload_presigned_url_when_size_over(): void
    {
        $requestParams = $this->makeRequestParams(size: 10485761);
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * 異常系 - 無効な拡張子を指定した場合422エラーが出る
     */
    public function test_generate_image_upload_presigned_url_when_invalid_extension(): void
    {
        $requestParams = $this->makeRequestParams(extension: 'org');
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * リクエストパラメータの作成
     *
     * @param ?string $documentName
     * @param ?string $fileName
     * @param ?int $size
     * @param ?string $extension
     *
     * @return array
     */
    private function makeRequestParams(
        $documentName = null,
        $fileName = null,
        $size = null,
        $extension = null,
    ): array {
        return [
            'document_name' => $documentName ?? $this->document->name,
            'file_name' => $fileName ?? '図1',
            'size' => $size ?? 10000,
            'extension' => $extension ?? 'png'
        ];
    }

    /**
     * S3Repositoryををモック化
     *
     * @return void
     */
    private function setS3Mock(): void
    {
        $s3Mock = m::mock(S3RepositoryImpl::class);
        $s3Mock->shouldReceive('generateUploadPresignedUrl')
            ->andReturn($this->presignedUrl);

        // 具象クラスの中身をmockにする
        $this->app->instance(S3Repository::class, $s3Mock);
    }

    /**
     * テスト共通処理
     *
     * @param array $requestParams
     *
     * @return TestResponse
     */
    private function commonExecution(array $requestParams): TestResponse
    {
        return $this->post(route('api.admin.document.image.presigned-url'), $requestParams);
    }
}
