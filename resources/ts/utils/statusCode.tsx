/**
 * ステータスコード
 *
 * 401: 認証エラー
 * 422: バリデーションエラー
 * 500: サーバーエラー
 *
 */
export const StatusCode = {
    UNAUTHORIZED: 401,
    VALIDATION: 422,
    SERVER_ERROR: 500,
} as const