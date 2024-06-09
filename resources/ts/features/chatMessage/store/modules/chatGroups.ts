import { createSlice } from "@reduxjs/toolkit";
import { ChatGroup, ResChatGroup } from "../../chatMessage";

/**
 * chatGroupsの状態管理
 */
const chatGroupsSlice = createSlice({
    name: 'chatGroups',
    initialState: [] as ChatGroup[],
    reducers: {
        /**
         * chatGroupsの初期化
         */
        initChatGroups: (chatGroups: ChatGroup[], { payload }) => {
            const resChatGroups: ResChatGroup[] = payload

            return resChatGroups.map((chatGroup) => {
                return {
                    ...chatGroup,
                    isDisplayPastChatMenu: false,
                    isEditingRename: false,
                }
            })
        },

        /**
         * isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を切り替える
         */
        toggleIsDisplayPastChatMenu: (chatGroups: ChatGroup[], { payload }) => {
            const chatGroupId: string = payload

            return chatGroups.map((chatGroup) => {
                return (
                    chatGroup.id === chatGroupId
                        ? { ...chatGroup, isDisplayPastChatMenu: true }
                        : { ...chatGroup, isDisplayPastChatMenu: false }
                )
            })
        },

        /**
         * isEditingRename（title編集中フラグ）を切り替える
         */
        toggleIsEditingRename: (chatGroups: ChatGroup[], { payload }) => {
            const chatGroupId: string = payload

            chatGroups.map((chatGroup) => {
                chatGroup.isEditingRename =
                    chatGroup.id === chatGroupId
                    ? true
                    : false

                return chatGroup
            })
        },

        /**
         * titleの更新
         */
        renameChatGroupsTitle: (chatGroups: ChatGroup[], { payload }) => {
            const { chatGroupId, title } = payload

            return chatGroups.map((chatGroup) => {
                return (
                    chatGroup.id === chatGroupId
                        ? { ...chatGroup, title: title }
                        : chatGroup
                )
            })
        },

        /**
         * 質問を検索
         */
        searchChatGroupsTitle: (chatGroups: ChatGroup[], { payload }) => {
            const { searchWord, chatGroupsCache } = payload

            return chatGroupsCache.filter((chatGroup: ChatGroup) => {
                const isMatch = chatGroup.title.indexOf(searchWord) !== -1
                return isMatch
            })
        }
    }
})

const chatGroupsReducer = chatGroupsSlice.reducer
const {
    initChatGroups,
    toggleIsDisplayPastChatMenu,
    toggleIsEditingRename,
    renameChatGroupsTitle,
    searchChatGroupsTitle,
} = chatGroupsSlice.actions;

export {
    initChatGroups,
    toggleIsDisplayPastChatMenu,
    toggleIsEditingRename,
    renameChatGroupsTitle,
    searchChatGroupsTitle,
}

export default chatGroupsReducer