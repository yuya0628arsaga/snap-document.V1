import { createSlice } from "@reduxjs/toolkit";
import { ChatGroup } from "../../chatMessage";

/**
 * chatGroupsの状態管理
 */
const chatGroupsCacheSlice = createSlice({
    name: 'chatGroupsCache',
    initialState: [] as ChatGroup[],
    reducers: {
        /**
         * 更新
         */
        updateChatGroupsCache: (chatGroups: ChatGroup[], { payload }) => {
            const newChatGroupsCache: ChatGroup[] = payload

            return newChatGroupsCache
        }
    }
})

const chatGroupsCacheReducer = chatGroupsCacheSlice.reducer
const {
    updateChatGroupsCache
} = chatGroupsCacheSlice.actions;

export {
    updateChatGroupsCache
}

export default chatGroupsCacheReducer