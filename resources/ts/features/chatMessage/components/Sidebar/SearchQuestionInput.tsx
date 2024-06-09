import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateChatGroupsCache } from '../../store/modules/chatGroupsCache';
import { searchChatGroupsTitle } from '../../store/modules/chatGroups';

const SearchQuestionInputWrapper = styled('div')`
    margin: 10px;
`

/**
 * 質問検索欄
 */
const SearchQuestionInput = React.memo(() => {
    const dispatch = useDispatch<AppDispatch>();
    const chatGroups = useSelector((state: RootState) => state.chatGroups);
    const chatGroupsCache = useSelector((state: RootState) => state.chatGroupsCache);

    /**
     * 質問検索欄にフォーカスが当たった時にChatGroupsのキャッシュを更新
     */
    const refreshChatGroupsCache = () => {
        dispatch(updateChatGroupsCache(chatGroups))
    }

    /**
     * 質問を検索
     */
    const searchChatGroups = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchWord: string = e.target.value
        dispatch(searchChatGroupsTitle({ searchWord: searchWord, chatGroupsCache: chatGroupsCache }))
    }

    return (
        <SearchQuestionInputWrapper>
            <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
            >
                <SearchIcon />
                <InputBase
                    sx={{ ml: 1, flex: 1, mt: 1 }}
                    placeholder="質問を検索"
                    onChange={searchChatGroups}
                    onFocus={refreshChatGroupsCache}
                />
            </Paper>
        </SearchQuestionInputWrapper>
    )
})

export default SearchQuestionInput