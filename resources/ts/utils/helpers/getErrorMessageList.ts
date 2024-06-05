import { StatusCode } from "../statusCode"

export const getErrorMessageList = (status: number, message: string) => {
    return {
        [StatusCode.UNAUTHORIZED]: `${message}`,
        [StatusCode.VALIDATION]: `${status}error： ${message}`,
        [StatusCode.SERVER_ERROR]: 'サーバーとの通信に問題があり処理が失敗しました。再度お試し下さい。'
    } as Record<number, string>
}

export const GENERAL_ERROR_MESSAGE = '不具合のため処理が失敗しました。再度お試し下さい。'