import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';

const SearchQuestionInputWrapper = styled('div')`
    margin: 10px;
`

type SearchQuestionInputPropsType = {
    searchChatGroups: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * 質問検索欄
 */
const SearchQuestionInput = React.memo((props: SearchQuestionInputPropsType) => {
    const { searchChatGroups } = props

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
                />
            </Paper>
        </SearchQuestionInputWrapper>
    )
})

export default SearchQuestionInput