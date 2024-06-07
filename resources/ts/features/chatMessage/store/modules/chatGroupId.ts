import { createSlice } from "@reduxjs/toolkit";

/**
 * chatGroupIdの状態管理
 */
const chatGroupIdSlice = createSlice({
    name: 'chatGroupId',
    initialState: null,
    reducers: {
        updateChatGroupId: (state, { payload }) => {
            return payload
        }
    }
})

const { updateChatGroupId } = chatGroupIdSlice.actions;
const chatGroupIdReducer = chatGroupIdSlice.reducer

export { updateChatGroupId }
export default chatGroupIdReducer