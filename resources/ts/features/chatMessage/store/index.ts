import { configureStore } from "@reduxjs/toolkit";
import chatGroupIdReducer from "./modules/chatGroupId";
import chatGroupsReducer from "./modules/chatGroups";
import chatGroupsCacheReducer from "./modules/chatGroupsCache";

/**
 * stateのグローバル管理
 */
const store = configureStore({
    reducer: {
        chatGroupId: chatGroupIdReducer,
        chatGroups: chatGroupsReducer,
        chatGroupsCache: chatGroupsCacheReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;