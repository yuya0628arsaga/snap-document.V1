import * as React from 'react';
import { FiEdit } from "react-icons/fi";
import styled from "@emotion/styled"
import { bgColor, fontWeight } from "../../../../utils/themeClient"

const NewChatButtonWrapper = styled('div')`
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    >.new-chat-button {
        width: 80%;
        height: 50%;
        padding: 0 5px;
        display: flex;
        :hover {
            cursor: pointer;
            background: ${bgColor.buttonGray};
            border-radius: 5px;
        }
        >.img {
            flex-grow: 1;
            display: flex;
            align-items: center;
        }
        >.text{
            flex-grow: 5;
            display: flex;
            align-items: center;
            font-weight: ${fontWeight.bold};
        }
        >.icon{
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
`

type NewChatButtonPropsType = {
    displayNewChat: () => void
}

/**
 * NewChatのボタン
 */
const NewChatButton = React.memo((props: NewChatButtonPropsType) => {
    const { displayNewChat } = props

    return (
        <NewChatButtonWrapper>
            <div onClick={displayNewChat} className='new-chat-button'>
                <div className='img'>
                    <img src="/images/icon/logo.png" alt=""/>
                </div>
                <div className='text'>New Chat</div>
                <div className='icon'><FiEdit /></div>
            </div>
        </NewChatButtonWrapper>
    )
})

export default NewChatButton