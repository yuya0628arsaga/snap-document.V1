import styled from '@emotion/styled';
import * as React from 'react';
import { bgColor, responsive } from '../../../../utils/themeClient';
import NewChatButton from '../NewChatButton';
import SearchQuestionInput from '../SearchQuestionInput';
import PastChat from '../PastChat';
import { Pagination } from '@mui/material';
import AccountPopupMenuButton from '../AccountPopupMenuButton';
import { ChatGroup } from '../../chatMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const SidebarWrapper = styled('div')`
    width: 20%;
    height: 100vh;
    background: ${bgColor.lightGray};
    @media (max-width: ${responsive.sp}) {
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 80px;
        transition: all 0.5s;
        right: -120%;
        z-index: 999;
        &.open {
            right: 0;
        }
    }

    display: flex;
    flex-direction: column;
    >.contents {
        height: calc(100vh - 60px);
        width: 100%;
        >.past-chats-container {
            height: calc(100vh - 60px - 80px);
            display: flex;
            flex-direction: column;
            gap: 10px;

            // スクロールバー（サイドバー）
            overflow-y: scroll;
            &::-webkit-scrollbar {
                visibility: hidden;
                width: 10px;
            }
            &::-webkit-scrollbar-thumb {
                visibility: hidden;
                border-radius: 20px;
            }
            &:hover::-webkit-scrollbar {
                visibility: visible;
            }
            &:hover::-webkit-scrollbar-thumb {
                visibility: visible;
                background: ${bgColor.buttonGray};
            }

            >.past-chats {
                display: flex;
                flex-direction: column;
                gap: 8px;
                flex-grow: 1; // paginationの位置を下に固定するため
                >.date {
                    margin: 0 8px;
                    @media (max-width: ${responsive.sp}) {
                        text-align: center;
                    }
                }
            }
            >.pagination {
                width: 100%;
                display: flex;
                justify-content: center;
            }
        }
    }
    >.sidebar-footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 20%;
        background: ${bgColor.lightGray};
        height: 60px;
        @media (max-width: ${responsive.sp}) {
            position: fixed;
            left: 120%;
            width: 100%;
            transition: all 0.5s;
        }
        >.account {
            height: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;
            @media (max-width: ${responsive.sp}) {
                display: block;
            }
        }

        &.open {
            left: 0;
        }
    }
`

type GroupByDateChatGroupsType = Record<string, ChatGroup[]>

const Sidebar = React.memo((props: any) => {
    const {
        isSpMenuOpen,
        displayNewChat,
        displayPastChat,
        openDeleteModal,
        displayPastChatMenu,
        closePastChatMenu,
        maxPagination,
        getChatGroupsPagination,
        currentPage,
        isGetPdfPage,
        setIsGetPdfPage,
        userName,
        gptModel,
        setGptModel,
    } = props

    const chatGroups = useSelector((state: RootState) => state.chatGroups);

    console.log('sidebar')

    /**
     * chatGroupsを日付でグルーピング
     */
     const groupByDateChatGroups = (chatGroups: ChatGroup[]) => {
        const groupByDateChatGroups = chatGroups.reduce((group: GroupByDateChatGroupsType, chatGroup: ChatGroup) => {

            group[chatGroup.lastChatDate] = group[chatGroup.lastChatDate] ?? [];
            group[chatGroup.lastChatDate].push(chatGroup);

            return group;

        }, {} as GroupByDateChatGroupsType);

        return groupByDateChatGroups
    }

    return (
        <SidebarWrapper className={isSpMenuOpen ? 'open' : ''}>
            <div className='contents'>
                <NewChatButton
                    displayNewChat={displayNewChat}
                />
                <div className='past-chats-container'>
                    <SearchQuestionInput />
                    <div className='past-chats'>
                        {Object.keys(groupByDateChatGroups(chatGroups)).map((date: string, i: number) => {
                            return (
                                <React.Fragment key={i}>
                                    <div className='date'>
                                        {date}
                                    </div>
                                    {groupByDateChatGroups(chatGroups)[date].map((chatGroup: ChatGroup, i: number) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <PastChat
                                                    chatGroup={chatGroup}
                                                    displayPastChat={displayPastChat}
                                                    openDeleteModal={openDeleteModal}
                                                    displayPastChatMenu={displayPastChatMenu}
                                                    closePastChatMenu={closePastChatMenu}
                                                />
                                            </React.Fragment>
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </div>
                    <div className='pagination'>
                        <Pagination count={maxPagination} onChange={getChatGroupsPagination} page={currentPage} />
                    </div>

                </div>
            </div>
            <div className={`sidebar-footer ${isSpMenuOpen ? 'open' : ''}`}>
                <div className='account'>
                    <AccountPopupMenuButton
                        isGetPdfPage={isGetPdfPage}
                        setIsGetPdfPage={setIsGetPdfPage}
                        userName={userName}
                        gptModel={gptModel}
                        setGptModel={setGptModel}
                    />
                </div>
            </div>
        </SidebarWrapper>
    )
})

export default Sidebar