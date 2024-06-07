import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { ChangeEvent, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontSize, fontWeight, responsive, textColor } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';
import SelectBox from '../../components/SelectBox';
import BasicModal from '../../components/BasicModal';
import { StatusCode } from '../../utils/statusCode';
import Pagination from '@mui/material/Pagination';
import AccountPopupMenuButton from './components/AccountPopupMenuButton';
import PastChat from './components/PastChat';
import SearchQuestionInput from './components/SearchQuestionInput';
import QuestionInput from './components/QuestionInput';
import NewChatButton from './components/NewChatButton';
import { GPT_MODEL_LIST } from '../../utils/constants';
import AccountMenuButton from './components/AccountMenuButton';
import Chat from './components/Chat';
import { GENERAL_ERROR_MESSAGE, getErrorMessageList } from '../../utils/helpers/getErrorMessageList';
import Child from './components/Sidebar/Child';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState } from './store';
import { updateChatGroupId } from './store/modules/chatGroupId';
import Sidebar from './components/Sidebar/Sidebar';
import {
    initChatGroups,
    renameChatGroupsTitle,
    searchChatGroupsTitle,
    toggleIsDisplayPastChatMenu,
    toggleIsEditingRename
} from './store/modules/chatGroups';

const Wrapper = styled('div')`
    display: flex;
`

const MainContainer = styled('div')`
    width: 80%;
    display: flex;
    flex-direction: column;
    height: 100vh;
    > .messages {
        position: relative; // ChatLoading表示のため
        flex: 1;

        // スクロールバー（チャット）
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
    }
    @media (max-width: ${responsive.sp}) {
        width: 100%;
    }
`

const Header = styled('div')`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 16px 0 16px;
    >.select-box {
        min-width: 60%;
    }
    >.hamburger {
        display: none;
        @media (max-width: ${responsive.sp}) {
            display: block;
            width: 32px;
            height: 32px;
            position: relative;
            appearance: none;
            border: 0;
            padding: 0;
            margin: 0;
            background-color: ${borderColor.white};
            cursor: pointer;
            z-index: 300;
            span, span::after, span::before {
                position: absolute;
                display: block;
                content: "";
                width: 100%;
                height: 2px;
                background-color: ${borderColor.blue};
                transition: all 0.5s;
            }
            span {
                &::before {
                    top: -10px;
                }
                &::after {
                    bottom: -10px;
                }
            }
            &.open span {
                background-color: transparent;
                &::before {
                    top: 0;
                    transform: rotate(45deg);
                }
                &::after {
                    bottom: 0;
                    transform: rotate(-45deg);
                }
            }
        }
    }
    .account-menu-button {
        @media (max-width: ${responsive.sp}) {
            display: none;
        }
    }
`

// 過去のchat表示のloading
const ChatLoading = styled('div')`
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const QuestionInputContainer = styled('div')`
    margin: 48px;
    @media (max-width: ${responsive.sp}) {
        margin: 16px 8px;
    }
`

const ErrorMessageContainer = styled('div')`
    padding: 24px;
    text-align: center;
    > .error-message {
        color: ${textColor.error};
    }
`

export type Chat = {
    id: string
    question: string,
    answer: string,
    images: { name: string, url: string }[],
    documentName: string,
    pdfPages: number[],
    isGenerating: boolean,
    isIncludeToHistory: boolean,
}

export type ChatGroup = {
    id: string,
    title: string,
    lastChatDate: string,
    isDisplayPastChatMenu: boolean,
    isEditingRename: boolean,
}

export type ResChatGroup = {
    id: string,
    title: string,
    lastChatDate: string,
}

type ChatMessagePropsType = {
    userName: string,
    avatarUrl: string,
}

const ChatMessage = (props: ChatMessagePropsType) => {
    const { userName, avatarUrl } = props

    const [inputQuestion, setInputQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [isDisplayChatGPT, setIsDisplayChatGPT] = useState(false)

    const [chats, setChats] = useState<Chat[]>([])

    const [manual, setManual] = React.useState('');
    const [isSelectManual, setIsSelectManual] = useState(true);

    // PDFページを取得するか否か
    const [isGetPdfPage, setIsGetPdfPage] = useState(true)
    // GPTのモデル
    const [gptModel, setGptModel] = useState(GPT_MODEL_LIST[0].value)

    // chatsの更新によるautoScroll()制御のため
    const [isChecking, setIsChecking] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const dispatch = useDispatch<AppDispatch>();
    const chatGroupId = useSelector((state: RootState) => state.chatGroupId);
    const chatGroups = useSelector((state: RootState) => state.chatGroups);

    /**
     * 質問入力のhandling
     */
    const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputQuestion(e.target.value)
        setErrorMessage('')
    }, [])

    /**
     * 質問に含めるチャット履歴を取得
     */
    const getChatHistory = (chats: Chat[]): string[][] => {
        const includedChatHistory = chats.filter((chat: Chat) => {
            return chat.isIncludeToHistory
        })

        const chatHistory = includedChatHistory.map((chat: Chat): string[] => {
            return [chat.question, chat.answer]
        })

        return chatHistory
    }

    /**
     * サーバに質問を投げて回答を取得
     */
    const postChats = (inputQuestion: string, manual: string, newChats: Chat[], chats: Chat[], chatGroupId: string | null): void => {
        axios({
            url: '/api/v1/chats/',
            method: 'POST',
            data: {
                question: inputQuestion,
                manualName: manual,
                chatHistory: getChatHistory(chats),
                chatGroupId: chatGroupId,
                isGetPdfPage: isGetPdfPage,
                gptModel: gptModel,
            }
        })
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data)

            const lastChat: Chat = newChats.slice(-1)[0];
            lastChat.answer = data.answer
            lastChat.images = data.images
            lastChat.pdfPages = data.pdfPages
            lastChat.isGenerating = false

            setChats(newChats)
            dispatch(updateChatGroupId(data.chatGroupId))

            // 質問入力欄を空に
            setInputQuestion('')

            // chatが投稿されたらサイドバーのchatGroupとpaginationを更新
            updateSidebarContents()
        })
        .catch((e: AxiosError): void => {
            if (axios.isAxiosError(e) && e.response) {
                console.error(e)
                const { status, message } = e.response.data as { status: number, message: string }
                const errorMessages = getErrorMessageList(status, message)
                setErrorMessage(errorMessages[status])
            } else {
                // general error
                console.error(e)
                setErrorMessage(GENERAL_ERROR_MESSAGE)
            }
            setChats(chats)
        })
        .then((): void => {
            setIsLoading(false)
        })
    }

    /**
     * 質問を送信
     */
    const sendQuestion = useCallback(() => {
        const MAX_CHAT = 15 // 一つのchatGroupに対して表示できるchatの最大数
        if (chats.length >= MAX_CHAT) {
            setErrorMessage(`1つのタイトルに対して${MAX_CHAT}回以上の質問はできません。\n質問するには「New Chat」ボタンで新しく会話を開始してください。`)
            return
        }
        if (isLoading || !inputQuestion) return;
        if (manual === '') {
            setIsSelectManual(false)
            return;
        }
        // エラーメッセージを空に
        setErrorMessage('')

        const elementId = Math.random().toString(36).slice(-8);
        const newChats: Chat[] = [...chats, { id: elementId, question: inputQuestion, answer: '', images: [], documentName: manual, pdfPages: [], isGenerating: true , isIncludeToHistory: false}]
        setChats(newChats)

        // ローディング表示
        setIsLoading(true)

        // GPTのアイコン表示
        setIsDisplayChatGPT(true)

        // API通信
        postChats(inputQuestion, manual, newChats, chats, chatGroupId)

        // 現在のchatGroupsのページネーションを１に
        setCurrentPage(1)
    }, [chats, isLoading, inputQuestion, manual, chatGroupId])

    /**
     * 質問が追加されたときに質問箇所まで自動スクロールする
     */
    const autoScroll = () => {
        const latestChat: Chat = chats.slice(-1)[0];
        if (!latestChat) return;

        const messageContainer = document.getElementById(`${latestChat.id}`) as HTMLElement;
        messageContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    useEffect(() => {
        // MEMO::chatのチェックボックスにチェック入れた場合もchatsが更新され、autoScroll()が実行されてしまうため制御
        if (!isChecking) {
            autoScroll()
        }

        setIsChecking(false)

    }, [chats])

    /**
     * チェックボックスにチェックを入れた(外した)chatの isIncludeToHistory を更新
     */
    const includeToHistory = (targetChat: Chat, chats: Chat[]) => {
        setIsChecking(true)

        const newChats: Chat[] =
            chats.map((chat: Chat): Chat => {
                if (chat.id !== targetChat.id) return chat

                chat.isIncludeToHistory = !chat.isIncludeToHistory
                return chat
            })

        setChats(newChats)
    }

    // ハンバーガーボタン押下時のメニューの開閉
    const [isSpMenuOpen, setIsSpMenuOpen] = useState(false)
    const openSpMenu = () => {
        setIsSpMenuOpen(prev => !prev)
    }

    const [allChatGroups, setAllChatGroups] = useState<ChatGroup[]>([])

    const [maxPagination, setMaxPagination] = useState(1)

    useEffect(() => {
        updateSidebarContents()
    }, [])

    /**
     * サイドバー（chatGroupsとpagination）を更新する
     */
    const updateSidebarContents = async () => {
        const resChatGroups: ResChatGroup[] = await getChatGroups()
        dispatch(initChatGroups(resChatGroups))

        const chatGroups = initializeChatGroups(resChatGroups)
        setAllChatGroups(chatGroups) // 質問検索のキャッシュのため

        const { chatGroupsCount } = await getChatGroupsCount()

        const maxPage: number = getMaxPage(chatGroupsCount)
        setMaxPagination(maxPage)
    }

    /**
     * paginationのページ数を出力
     */
    const getMaxPage = (chatGroupsCount: number): number => {
        const MAX_CHAT_GROUPS_COUNTS = 10 // サーバから取得する一回のchatGroupsの最大数
        const quotient = Math.floor(chatGroupsCount / MAX_CHAT_GROUPS_COUNTS)
        const remainder = chatGroupsCount % MAX_CHAT_GROUPS_COUNTS
        const maxPage = remainder ? quotient + 1 : quotient

        return maxPage ? maxPage : 1 // maxPageが0の場合は1を表示
    }

    /**
     * chatGroupsの初期化
     * FIXME::命名変える必要あり（storeのinitChatGroupsと被ったため一旦この命名にした）
     */
    const initializeChatGroups = (resChatGroups: ResChatGroup[]) => {
        const chatGroups: ChatGroup[] = resChatGroups.map((chatGroup) => {
            return {
                ...chatGroup,
                isDisplayPastChatMenu: false,
                isEditingRename: false,
            }
        })

        return chatGroups
    }

    /**
     * サーバからチャットグループを取得
     */
    const getChatGroups = (page: number = 1): Promise<ResChatGroup[]> => {
        return new Promise((resolve, reject) => {
            axios({
                url: `/api/v1/chat-groups/?page=${page}`,
                method: 'GET',
            })
            .then((res: AxiosResponse): void => {
                const { data } = res
                console.log(data)
                resolve(data)
            })
            .catch((e: AxiosError): void => {
                console.error(e)
                reject(e)
            })
        })
    }

    /**
     * サーバからチャットグループのレコード数を取得
     */
    const getChatGroupsCount = (): Promise<{chatGroupsCount: number}> => {
        return new Promise((resolve, reject) => {
            axios({
                url: `/api/v1/chat-groups/count`,
                method: 'GET',
            })
            .then((res: AxiosResponse): void => {
                const { data } = res
                console.log(data)
                resolve(data)
            })
            .catch((e: AxiosError): void => {
                console.error(e)
                reject(e)
            })
        })
    }

    /**
     * チャットグループIDでチャットを取得
     */
    const getChats = (chatGroupId: string): Promise<Chat[]> => {
        return new Promise((resolve, reject) => {
            axios({
                url: '/api/v1/chats/',
                method: 'GET',
                params: {
                    'chat_group_id': chatGroupId
                }
            })
            .then((res: AxiosResponse): void => {
                const { data } = res
                console.log(data)
                resolve(data)
            })
            .catch((e: AxiosError): void => {
                console.error(e)
                reject(e)
            })
        })
    }

    /**
     * 質問を検索
     */
    const searchChatGroups = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchWord: string = e.target.value
        dispatch(searchChatGroupsTitle({ searchWord: searchWord, allChatGroups: allChatGroups }))
    }, [allChatGroups])

    /**
     * 質問検索欄にフォーカスが当たった時にChatGroupsのキャッシュを更新
     */
    const refreshChatGroupsCache = useCallback(() => {
        setAllChatGroups(chatGroups)
    }, [chatGroups])

    const [isChatLoading, setIsChatLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    /**
     * 過去の質問を表示
     */
    const displayPastChat = useCallback(async (chatGroup: ChatGroup) => {
        const isEditingRename = chatGroup.isEditingRename  // title編集中はイベント発火させない
        const chatGroupId = chatGroup.id
        if (isEditingRename) return

        setIsChatLoading(true)

        const chats = await getChats(chatGroupId)
        setChats(chats)
        setIsChatLoading(false)

        dispatch(updateChatGroupId(chatGroupId))
        setIsDisplayChatGPT(true)
        setIsSpMenuOpen(prev => !prev)
    }, [chatGroups, isSpMenuOpen])

    /**
     * 新しい質問を開始
     */
    const displayNewChat = useCallback(async () => {
        setChats([])
        dispatch(updateChatGroupId(''))
        setIsSpMenuOpen(prev => !prev)
        setErrorMessage('') // エラーメッセージを空に

        // setChatGroups(chatGroups)
    }, [chatGroups, isSpMenuOpen])

    /**
     * pastChatのポップアップメニューを開く（クリック時に3点リーダー活性化させるため）
     */
    const displayPastChatMenu = useCallback((chatGroupId: string) => {

        // isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を切り替える
        dispatch(toggleIsDisplayPastChatMenu(chatGroupId))
    }, [chatGroups])

    /**
     * pastChatのポップアップメニューを閉じる（クリック時に3点リーダーを非活性にさせるため）
     */
    const closePastChatMenu = useCallback(() => {
        // isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を全てfalseにする
        dispatch(toggleIsDisplayPastChatMenu(''))
    }, [chatGroups])

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
    const [modalDescription, setModalDescription] = useState('')
    const [deleteTargetChatGroupId, setDeleteTargetChatGroupId] = useState('')

    /**
     * 削除モーダルをopen
     */
    const openDeleteModal = useCallback((chatGroupId: string, chatGroupTitle: string) => {
        // 削除対象のchatGroupId
        setDeleteTargetChatGroupId(chatGroupId)

        const modalDescriptionMessage = `${chatGroupTitle} を削除しますか？`
        setModalDescription(modalDescriptionMessage)
        setIsOpenDeleteModal(true)
    }, [chatGroups])

    /**
     * chatGroupを削除しサイドバー更新
     */
    const executeDelete = async (deleteTargetChatGroupId: string, currentlyOpenChatGroupId: string | null) => {
        await deleteChatGroup(deleteTargetChatGroupId)

        const resChatGroups = await getChatGroups(currentPage)
        dispatch(initChatGroups(resChatGroups))

        // 今開いているchatが削除したchatGroupのものなら画面をnewChatにし、他のchatGroupのものなら、そのままの画面にする
        refreshChats(deleteTargetChatGroupId, currentlyOpenChatGroupId)
    }

    /**
     * chatGroup削除
     */
    const deleteChatGroup = (chatGroupId: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            axios({
                url: `/api/v1/chat-groups/${chatGroupId}`,
                method: 'DELETE',
            })
            .then((res: AxiosResponse): void => {
                resolve(true)
            })
            .catch((e: AxiosError): void => {
                console.error(e)
                reject(e)
            })
        })
    }

    /**
     * 削除したchatGroupの画面を削除時に開いていた場合に、chat画面を初期化
     */
    const refreshChats = (deletedChatGroupId: string, currentlyOpenChatGroupId: string | null) => {
        if (deleteTargetChatGroupId === currentlyOpenChatGroupId) {
            setChats([])
            dispatch(updateChatGroupId(''))
        }
    }

    /**
     * chatGroupsのページネーション押下時
     */
    const getChatGroupsPagination = async (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page)

        const resChatGroups = await getChatGroups(page)
        dispatch(initChatGroups(resChatGroups))
    }

    console.log(111111111)

    return (
        <>
            <BasicModal
                open={isOpenDeleteModal}
                setOpen={setIsOpenDeleteModal}
                modalTitle={'Delete chat'}
                modalDescription={modalDescription}
                buttonType={'error'}
                buttonText={'削除'}
                handleExecute={() => {executeDelete(deleteTargetChatGroupId, chatGroupId)}}
            />
            <Wrapper>
                <Sidebar
                    isSpMenuOpen={isSpMenuOpen}
                    displayNewChat={displayNewChat}
                    searchChatGroups={searchChatGroups}
                    refreshChatGroupsCache={refreshChatGroupsCache}
                    displayPastChat={displayPastChat}
                    openDeleteModal={openDeleteModal}
                    displayPastChatMenu={displayPastChatMenu}
                    closePastChatMenu={closePastChatMenu}
                    maxPagination={maxPagination}
                    getChatGroupsPagination={getChatGroupsPagination}
                    currentPage={currentPage}
                    isGetPdfPage={isGetPdfPage}
                    setIsGetPdfPage={setIsGetPdfPage}
                    userName={userName}
                    gptModel={gptModel}
                    setGptModel={setGptModel}
                />

                <MainContainer>
                    <Child />
                    <Header>
                        <div className='select-box'>
                            <SelectBox isSelectManual={isSelectManual} setIsSelectManual={setIsSelectManual} manual={manual} setManual={setManual} />
                        </div>
                        <button className={`hamburger ${isSpMenuOpen ? 'open' : ''}`} onClick={openSpMenu}><span></span></button>
                        <div className='account-menu-button'>
                            <AccountMenuButton
                                isGetPdfPage={isGetPdfPage}
                                setIsGetPdfPage={setIsGetPdfPage}
                                gptModel={gptModel}
                                setGptModel={setGptModel}
                                avatarUrl={avatarUrl}
                            />
                        </div>
                    </Header>
                    <div className="messages" id="scroll-target">
                        {isChatLoading &&
                            <ChatLoading>
                                <CircularProgress disableShrink size={50}/>
                            </ChatLoading>
                        }
                        {chats.map((chat: Chat, i: number) => {
                            return (
                                <Chat
                                    key={i}
                                    chat={chat}
                                    chats={chats}
                                    isDisplayChatGPT={isDisplayChatGPT}
                                    includeToHistory={includeToHistory}
                                />
                            )
                        })}
                    </div>

                    <QuestionInputContainer>
                        <QuestionInput
                            inputQuestion={inputQuestion}
                            handleChangeInput={handleChangeInput}
                            sendQuestion={sendQuestion}
                            isLoading={isLoading}
                        />
                    </QuestionInputContainer>
                    {errorMessage &&
                        <ErrorMessageContainer>
                            <div className='error-message'>
                                {/* Fix::改行反映のため */}
                                {errorMessage.split("\n").map((message, index) => {
                                    return (
                                        <React.Fragment key={index}>{message}<br /></React.Fragment>
                                    )
                                })}
                            </div>
                        </ErrorMessageContainer>}

                </MainContainer>
            </Wrapper>
        </>
    )
}

export default ChatMessage

const element = document.getElementById('chat-message')
if (element) {
  const props = element.dataset.props
  const reactProps = props ? JSON.parse(props) : null
    createRoot(element).render(
        <Provider store={store}>
            <ChatMessage {...reactProps} />
        </Provider>
    )
}
