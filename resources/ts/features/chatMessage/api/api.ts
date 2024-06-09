import axios, { AxiosError, AxiosResponse } from "axios"
import { Chat, ResChatGroup } from "../chatMessage"

type RequestParamType = {
    url: string,
    method: string,
    params?: any,
    data?: any,
}

/**
 * サーバからチャットグループのレコード数を取得
 */
export const getChatGroupsCount = (): Promise<{ chatGroupsCount: number }> => {
    return requestApi({
        url: `/api/v1/chat-groups/count`,
        method: 'GET',
    })
}

/**
 * サーバからチャットグループを取得
 */
export const getChatGroups = (page: number = 1): Promise<ResChatGroup[]> => {
    return requestApi({
        url: `/api/v1/chat-groups/?page=${page}`,
        method: 'GET',
    })
}

/**
 * chatGroup削除
 */
export const deleteChatGroup = (chatGroupId: string): Promise<unknown> => {
    return requestApi({
        url: `/api/v1/chat-groups/${chatGroupId}`,
        method: 'DELETE',
    })
}

/**
 * チャットグループIDでチャットを取得
 */
export const getChats = (chatGroupId: string): Promise<Chat[]> => {
    return requestApi({
        url: '/api/v1/chats/',
        method: 'GET',
        params: {
            'chat_group_id': chatGroupId
        }
    })
}

/**
 * サーバに質問を投げて回答を取得
 */
export const postChats = (
    inputQuestion: string,
    manual: string,
    chatGroupId: string | null,
    chatHistory: string[][],
    isGetPdfPage: boolean,
    gptModel: string
) => {
    return requestApi({
        url: '/api/v1/chats/',
        method: 'POST',
        data: {
            question: inputQuestion,
            manualName: manual,
            chatHistory: chatHistory,
            chatGroupId: chatGroupId,
            isGetPdfPage: isGetPdfPage,
            gptModel: gptModel,
        }
    })
}

/**
 * リクエスト共通処理
 */
const requestApi = (requestParam: RequestParamType) => {
    return new Promise((resolve: (value: any) => void, reject: (reason?: any) => void) => {
        axios(requestParam)
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data)
            resolve(data)
        })
        .catch((e: AxiosError): void => {
            console.error(e)
            reject(e)
        })
    })
}