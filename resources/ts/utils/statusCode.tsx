/**
 * ステータスコード
 *
 * 422: バリデーションエラー
 * 500: サーバーエラー
 *
 */
export const StatusCode = {
    VALIDATION: 422,
    SERVER_ERROR: 500,
} as const