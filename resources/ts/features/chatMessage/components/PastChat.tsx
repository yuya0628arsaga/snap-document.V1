import * as React from 'react';
import PastChatMenuButton from "./PastChatMenuButton"
import styled from '@emotion/styled';
import { bgColor, borderColor, fontSize, responsive, textColor } from '../../../utils/themeClient';
import { ChatGroup } from '../chatMessage';

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
    chatGroups: ChatGroup[],
    chatGroup: ChatGroup,
    chatGroupId: string | null,
    displayPastChat: (chatGroup: ChatGroup) => void,
    renameTitle: (e: React.ChangeEvent<HTMLInputElement>, chatGroupsId: string, chatGroups: ChatGroup[]) => void,
    outOfTitleInput: () => void,
    chatGroupTitleInputRef: React.MutableRefObject<null>,
    convertTitleToInput: (chatGroupId: string) => void,
    openDeleteModal: (chatGroupId: string, chatGroupTitle: string) => void,
    displayPastChatMenu: (chatGroupId: string) => void,
    closePastChatMenu: () => void,
    validationMessageOfTitle: string,
}

const PastChat = (props: PastChatPropsType) => {
    const {
        chatGroups,
        chatGroup,
        chatGroupId,
        displayPastChat,
        renameTitle,
        outOfTitleInput,
        chatGroupTitleInputRef,
        convertTitleToInput,
        openDeleteModal,
        displayPastChatMenu,
        closePastChatMenu,
        validationMessageOfTitle,
    } = props

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
                            onBlur={outOfTitleInput}
                            ref={chatGroupTitleInputRef}
                        />
                        : chatGroup.title
                    }
                </div>
                <PastChatMenuButton
                    chatGroup={chatGroup}
                    convertTitleToInput={convertTitleToInput}
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
}

export default PastChat