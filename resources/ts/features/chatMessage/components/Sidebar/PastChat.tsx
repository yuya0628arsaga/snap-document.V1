import * as React from 'react';
import PastChatMenuButton from "./PastChatMenuButton"
import styled from '@emotion/styled';
import { bgColor, borderColor, fontSize, responsive, textColor } from '../../../../utils/themeClient';
import { ChatGroup } from '../../chatMessage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { renameChatGroupsTitle, toggleIsEditingRename } from '../../store/modules/chatGroups';
import axios, { AxiosError, AxiosResponse } from 'axios';

const PastChatWrapper = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: ${bgColor.lightGray};
    height: 70px;
    padding: 8px;
    position: relative;

    > .past-chat-button {
        display: flex;
        align-items: center;
        gap: 5px;

        background: ${bgColor.white};
        padding: 5px 10px;
        border: 1px solid ${borderColor.gray};
        border-radius: 5px;
        height: 100%;
        width: 100%;
        cursor: pointer;

        &:hover {
            background: ${bgColor.buttonGray};
        }
        &.active {
            background: ${bgColor.buttonGray};
        }
        @media (max-width: ${responsive.sp}) {
            width: 90%;
            margin: 0 auto;
        }

        >.text {
            width: 90%;
            height: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            align-items: center;
            > input {
                width: 100%;
            }
        }
    }

    >.validation-message {
        color: ${textColor.error};
        font-size: ${fontSize.sm};
    }
`

type PastChatPropsType = {
    chatGroup: ChatGroup,
    displayPastChat: (chatGroup: ChatGroup) => void,
    openDeleteModal: (chatGroupId: string, chatGroupTitle: string) => void,
    displayPastChatMenu: (chatGroupId: string) => void,
    closePastChatMenu: () => void,
}

const PastChat = React.memo((props: PastChatPropsType) => {
    const {
        chatGroup,
        displayPastChat,
        openDeleteModal,
        displayPastChatMenu,
        closePastChatMenu,
    } = props

    const dispatch = useDispatch<AppDispatch>();
    const chatGroupId = useSelector((state: RootState) => state.chatGroupId);
    const chatGroups = useSelector((state: RootState) => state.chatGroups);

    const [validationMessageOfTitle, setValidationMessageOfTitle] = React.useState('')

    const chatGroupTitleInputRef = React.useRef<HTMLInputElement>(null)

    // 編集ボタン押下時にtitleのinputタグにフォーカスを自動で当てる
    React.useEffect(() => {
        chatGroupTitleInputRef.current?.focus()
    }, [chatGroups])

    /**
     * chatGroupのtitle名を修正する
     */
    const renameTitle = (
        e: React.ChangeEvent<HTMLInputElement>,
        chatGroupId: string, chatGroups: ChatGroup[]
    ) => {
        const title = e.target.value
        // titleの更新
        dispatch(renameChatGroupsTitle({ chatGroupId, title }))
    }

    /**
     * titleのinputからフォーカスが外れた時に更新する
     */
    const outOfTitleInput = () => {
        updateTitle(chatGroups)
    }

    /**
     * titleのinputでEnterが押された時に更新する
     */
    const onKeyDownTitleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateTitle(chatGroups)
        };
    }

    /**
     * chatGroupのtitle名を更新する
     */
    const updateTitle = (chatGroups: ChatGroup[]) => {
        if (!chatGroupTitleInputRef.current) return;

        const chatGroupId = chatGroupTitleInputRef.current.id
        const title = chatGroupTitleInputRef.current.value

        const MAX_STR_COUNT = 255

        if (!title || title.length > MAX_STR_COUNT) {
            setValidationMessageOfTitle('1~255文字以内で入力してください。')
            return
        }
        // titleのupdate（サーバー）
        updateChatGroupTitle(chatGroupId, title)

        // isEditingRename（title編集中フラグ）を元に戻す
        dispatch(toggleIsEditingRename(''))
    }

    /**
     * チャットグループtitleを更新
     */
    const updateChatGroupTitle = (chatGroupId: string, title: string): void => {
        axios({
            url: '/api/v1/chat-groups/',
            method: 'POST',
            params: {
                'chatGroupId': chatGroupId,
                'title': title,
            }
        })
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data)
        })
        .catch((e: AxiosError): void => {
            console.error(e)
        })
    }

    return (
        <PastChatWrapper>
            <div className={ `past-chat-button ${chatGroup.id === chatGroupId ? 'active' : ''}`}>
                <div className='text' onClick={() => { displayPastChat(chatGroup) }}>
                    {chatGroup.isEditingRename
                        ? <input
                            type="text"
                            id={chatGroup.id}
                            value={chatGroup.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { renameTitle(e, chatGroup.id, chatGroups) }}
                            onKeyDown={onKeyDownTitleInput}
                            onBlur={outOfTitleInput}
                            ref={chatGroupTitleInputRef}
                        />
                        : chatGroup.title
                    }
                </div>
                <PastChatMenuButton
                    chatGroup={chatGroup}
                    openDeleteModal={openDeleteModal}
                    displayPastChatMenu={displayPastChatMenu}
                    closePastChatMenu={closePastChatMenu}
                />
            </div>
            {(chatGroup.isEditingRename && validationMessageOfTitle) &&
                <div className='validation-message'>{validationMessageOfTitle}</div>
            }
        </PastChatWrapper>
    )
})

export default PastChat