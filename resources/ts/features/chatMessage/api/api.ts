import axios, { AxiosError, AxiosResponse } from "axios"
import { ResChatGroup } from "../chatMessage"

/**
 * サーバからチャットグループのレコード数を取得
 */
export const getChatGroupsCount = (): Promise<{chatGroupsCount: number}> => {
    return new Promise((resolve, reject) => {
        axios({
            url: `/api/v1/chat-groups/count`,
            method: 'GET',
        })
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

/**
 * サーバからチャットグループを取得
 */
export const getChatGroups = (page: number = 1): Promise<ResChatGroup[]> => {
    return new Promise((resolve, reject) => {
        axios({
            url: `/api/v1/chat-groups/?page=${page}`,
            method: 'GET',
        })
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