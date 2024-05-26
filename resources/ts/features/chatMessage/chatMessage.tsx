import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontSize, fontWeight, responsive, textColor } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SelectBox from '../../components/SelectBox';
import BasicModal from '../../components/BasicModal';
import { StatusCode } from '../../utils/statusCode';
import CheckboxLabels from '../../components/Checkbox';
import Pagination from '@mui/material/Pagination';
import AccountPopupMenuButton from './components/AccountPopupMenuButton';
import PastChat from './components/PastChat';
import SearchQuestionInput from './components/SearchQuestionInput';
import NewChatButton from './components/NewChatButton';
import { GPT_MODEL_LIST } from '../../utils/constants';


const Wrapper = styled('div')`
    display: flex;
`

const MainContainer = styled('div')`
    /* flex-grow: 8; */
    width: 80%;
    display: flex;
    flex-direction: column;
    /* padding-top: 48px; */
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

const SidebarContainer = styled('div')`
    /* flex-grow: 2; */
    /* min-width: 220px; */
    width: 20%;
    height: 100vh;
    /* background: yellow; */
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
        height: calc(100vh - 120px);
        width: 100%;
        >.past-chats-container {
            height: calc(100vh - 120px - 80px);
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
        height: 120px;
        @media (max-width: ${responsive.sp}) {
            position: fixed;
            left: 120%;
            width: 100%;
            transition: all 0.5s;
        }
        >.hoge {
            height: 50%;
        }
        >.account {
            height: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &.open {
            left: 0;
        }
    }
`

const Header = styled('div')`
    display: flex;
    align-items: center;
    gap: 28%;
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
`

const MessageContainer = styled('div')`
    max-width: 60%;
    margin: 1% auto;
    /* height: 80vh; */
    overflow-y: scroll;
    ::-webkit-scrollbar {
        display:none;
    }
    @media (max-width: ${responsive.sp}) {
        max-width: 90%;
    }
`

const UsersQuestion = styled('div')`
    padding: 20px;
    background: ${bgColor.lightGray};
    display: flex;
    gap: 10px;
    border-radius: 5px;
    align-items: flex-start;
    > .icon {
        /* background: ${bgColor.blue}; */
        background: ${bgColor.yellow};
        border-radius: 5px;
        padding: 3px;
        display: flex;
    }
    >.text {
        >.name {
            font-weight: ${fontWeight.bold};
            margin: 3px 0;
            display: block;
        }
    }
`

// 回答表示のloading
const Load = styled('div')`
    display: flex;
    gap: 10px;
    margin: 16px 0;
`

// 過去のchat表示のloading
const ChatLoading = styled('div')`
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const AiAnswer = styled('div')`
    padding: 20px;
    background: ${bgColor.lightGray};
    display: flex;
    gap: 10px;
    /* border-radius: 5px; */
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    align-items: flex-start;

    > .icon {
        background: ${bgColor.blue};
        border-radius: 5px;
        padding: 3px;
        display: flex;
    }
    >.text {
        >.name {
            font-weight: ${fontWeight.bold};
            margin: 3px 0;
            display: block;
        }
        >.img-container {
            text-align: center;
            margin-top: 32px;

            display: flex;
            flex-direction: column;
            gap: 10px;
            >.img {
                width: 80%;
                height: auto;
                margin: 0 auto;
                @media (max-width: ${responsive.sp}) {
                    width: 100%;
                }
            }
            >.img-text{
            }
        }
        >.url-title {
            margin-top: 32px;
        }
        >.url {
            > a {
                color: ${borderColor.blue};
            }
        }
        >.checkbox-container {
            margin-top: 32px;
        }
    }
`

const FormContainer = styled('div')`
    margin: 48px;
    @media (max-width: ${responsive.sp}) {
        margin: 16px 8px;
    }
    > div {
        position: relative;
    }
`

const InputText = styled('textarea')`
    resize: none;
    height:200px;

    background: ${bgColor.lightGray};
    border: 1px solid ${borderColor.gray};
    border-radius: 5px;
    height: 40px;
    width: 85%;
    padding: 8px;
    :focus {
        outline: 1px ${borderColor.blue} solid;
    }
    @media (max-width: ${responsive.sp}) {
        width: 90%;
        /* margin: 0 auto; */
    }

    // スクロールバー（質問入力欄）
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
        /* visibility: hidden; */
        background: ${bgColor.buttonGray};
    }
`

const ErrorMessageContainer = styled('div')`
    padding: 24px;
    text-align: center;
    > .error-message {
        color: ${textColor.error};
    }
`

type Chat = {
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

type ResChatGroup = {
    id: string,
    title: string,
    lastChatDate: string,
}

type GroupByDateChatGroupsType = {
    [lastChatDate: string]: ChatGroup[]
}

type ChatMessagePropsType = {
    userName: string
}
const ChatMessage = (props: ChatMessagePropsType) => {
    const { userName } = props

    const [inputQuestion, setInputQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [isDisplayChatGPT, setIsDisplayChatGPT] = useState(false)

    const [chats, setChats] = useState<Chat[]>([])
    const [chatGroupId, setChatGroupId] = useState<string | null>(null)

    const [manual, setManual] = React.useState('');
    const [isSelectManual, setIsSelectManual] = useState(true);

    // PDFページを取得するか否か
    const [isGetPdfPage, setIsGetPdfPage] = useState(true)
    // GPTのモデル
    const [gptModel, setGptModel] = useState(GPT_MODEL_LIST[0].value)

    // chatsの更新によるautoScroll()制御のため
    const [isChecking, setIsChecking] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const SendButton = styled('button')`
        cursor: ${ (isLoading || !inputQuestion) && 'default'};
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10%;
    `

    const [ textareaHeight, setTextareaHeight ] = useState(0);
    const textAreaRef = useRef(null);
    const invisibleTextAreaRef = useRef<HTMLTextAreaElement>(null);

    // テキスト量に応じてtextareaの高さを自動調整する
    useEffect(() => {
    if (invisibleTextAreaRef.current) {
        const MAX_HEIGHT = 256
        if (invisibleTextAreaRef.current.scrollHeight >= MAX_HEIGHT) return;
        setTextareaHeight(invisibleTextAreaRef.current.scrollHeight);
    }
    }, [inputQuestion]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputQuestion(e.target.value)
    }

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
            // data: { question: inputQuestion, manualName: manual, chatHistory: [['question1', 'answer1'], ['question2', 'answer2']] }
            // data: { question: '具体的にどの学部に行けばいいか教えてください。', manualName: manual, chatHistory: [['私は医者です。医者の平均収入を教えて下さい。', '医者の平均収入は、専門性や経験によって異なりますが、一般的には年間で数百万円から数千万円の間になることがあります。'], ['具体的にいくらですか？', '医者の平均収入は、専門性や経験によって異なりますが、一般的には年間で数百万円から数千万円の範囲になることがあります。例えば、一般開業医の場合、年収は1000万円以上になることが一般的です。特に専門医や大学病院の医師などは、それ以上の高収入を得ることもあります。']] }
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
            setChatGroupId(data.chatGroupId);

            // chatGroupで一番最初の質問だった場合サイドバーのchatGroup更新
            (async () => {
                const resChatGroups = await getChatGroups(1)
                const chatGroups = initChatGroups(resChatGroups)
                setChatGroups(chatGroups)
            })()
        })
        .catch((e: AxiosError): void => {
            if (axios.isAxiosError(e) && e.response) {
                console.error(e)
                const { status, message } = e.response.data as { status: number, message: string }
                const errorMessages = {
                    [StatusCode.VALIDATION]: `${status}エラー： ${message}`,
                    [StatusCode.SERVER_ERROR]: 'サーバーとの通信に問題があり処理が失敗しました。再度お試し下さい。'
                }
                setErrorMessage(errorMessages[status])
            } else {
                // general error
                console.error(e)
                setErrorMessage('不具合のため処理が失敗しました。再度お試し下さい。')
            }
            setChats(chats)
        })
        .then((): void => {
            setIsLoading(false)
        })
    }

    const sendQuestion = () => {
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

        // const elementId = crypto.randomUUID();
        const elementId = Math.random().toString(36).slice(-8);
        const newChats: Chat[] = [...chats, { id: elementId, question: inputQuestion, answer: '', images: [], documentName: manual, pdfPages: [], isGenerating: true , isIncludeToHistory: false}]
        setChats(newChats)

        // ローディング表示
        setIsLoading(true)

        // GPTのアイコン表示
        setIsDisplayChatGPT(true)

        // API通信
        postChats(inputQuestion, manual, newChats, chats, chatGroupId)

        // 質問入力欄を空に
        setInputQuestion('')

        // 現在のchatGroupsのページネーションを１に
        setCurrentPage(1)
    }

    /**
     * chatGroupに新しい質問を投稿した場合に、サイドバーにてそのchatGroupを一番上に持ってくる
     */
    const sortChatGroups = (chatGroups: ResChatGroup[]) => {
        Object.keys(chatGroups).map((date: string) => {
            const otherChatGroups = chatGroups[date].filter((chatGroup: ChatGroup) => {
                return chatGroup.id !== chatGroupId
            })
            const targetChatGroup = chatGroups[date].filter((chatGroup: ChatGroup) => {
                return chatGroup.id === chatGroupId
            })

            chatGroups[date] = otherChatGroups

            if (!targetChatGroup.length) return
            const firstOfChatGroups: ChatGroup[] = Object.entries<ChatGroup[]>(chatGroups)[0][1]
            firstOfChatGroups.unshift(targetChatGroup[0])
        })

        return chatGroups
    }

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


    const [chatGroups, setChatGroups] = useState<ChatGroup[]>([])
    const [maxPagination, setMaxPagination] = useState(1)

    useEffect(() => {
        (async (): Promise<void> => {
            const resChatGroups: ResChatGroup[] = await getChatGroups()
            const chatGroups = initChatGroups(resChatGroups)

            setChatGroups(chatGroups)

            const { chatGroupsCount } = await getChatGroupsCount()

            const maxPage: number = getMaxPage(chatGroupsCount)
            setMaxPagination(maxPage)
        })()
    }, [])

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
     */
    const initChatGroups = (resChatGroups: ResChatGroup[]) => {
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
     * chatGroupsを日付でグルーピング
     */
    const groupByDateChatGroups = (chatGroups: ChatGroup[]) => {
        const groupByDateChatGroups: GroupByDateChatGroupsType[] = chatGroups.reduce((group: any, chatGroup: ChatGroup) => {

            group[chatGroup.lastChatDate] = group[chatGroup.lastChatDate] ?? [];
            group[chatGroup.lastChatDate].push(chatGroup);

            return group;

        }, []);

        return groupByDateChatGroups
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
        const resChatGroups: ResChatGroup[] = await getChatGroups()
        const chatGroups = initChatGroups(resChatGroups)

        const filteredChangeGroup = chatGroups.filter((chatGroup) => {
            const isMatch = chatGroup.title.indexOf(searchWord) !== -1
            return isMatch
        })

        setChatGroups(filteredChangeGroup)
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

        setChatGroupId(chatGroupId)
        setIsDisplayChatGPT(true)
        setIsSpMenuOpen(prev => !prev)
    }, [chatGroups, isSpMenuOpen])

    /**
     * 新しい質問を開始
     */
    const displayNewChat = useCallback(async () => {
        setChats([])
        setChatGroupId('')
        setIsSpMenuOpen(prev => !prev)
        setErrorMessage('') // エラーメッセージを空に

        setChatGroups(chatGroups)
    }, [chatGroups, isSpMenuOpen])

    /**
     * pastChatのポップアップメニューを開く（クリック時に3点リーダー活性化させるため）
     */
    const displayPastChatMenu = useCallback((chatGroupId: string) => {

        // isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を切り替える
        const editedChatGroups: ChatGroup[] = chatGroups.map((chatGroup) => {
            return (
                chatGroup.id === chatGroupId
                    ? { ...chatGroup, isDisplayPastChatMenu: true }
                    : { ...chatGroup, isDisplayPastChatMenu: false }
            )
        })

        setChatGroups(editedChatGroups)
    }, [chatGroups])

    /**
     * pastChatのポップアップメニューを閉じる（クリック時に3点リーダーを非活性にさせるため）
     */
    const closePastChatMenu = useCallback(() => {
        // isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を全てfalseにする
        const editedChatGroups: ChatGroup[] = chatGroups.map((chatGroup) => {
            return { ...chatGroup, isDisplayPastChatMenu: false }
        })

        setChatGroups(editedChatGroups)
    }, [chatGroups])

    const chatGroupTitleInputRef = useRef(null)

    /**
     * titleをinputタグに変換する
     */
    const convertTitleToInput = useCallback((chatGroupId: string) => {

        // // isEditingRename（title編集中フラグ）を切り替える
        // const editedChatGroups: ChatGroup[] = chatGroups.map((chatGroup) => {
        //     return (
        //         chatGroup.id === chatGroupId
        //             ? { ...chatGroup, isEditingRename: true }
        //             : { ...chatGroup, isEditingRename: false }
        //     )
        // })

        // isEditingRename（title編集中フラグ）を切り替える
        const editedChatGroups: ChatGroup[] = chatGroups.map((chatGroup) => {
            chatGroup.isEditingRename =
                chatGroup.id === chatGroupId
                ? true
                : false

            return chatGroup
        })

        setChatGroups(editedChatGroups)
    }, [chatGroups])

    /**
     * chatGroupのtitle名を修正する
     */
    const renameTitle = useCallback((e: ChangeEvent<HTMLInputElement>, chatGroupId: string, chatGroups: ChatGroup[]) => {
        // titleの更新
        const editedChatGroups: ChatGroup[] = chatGroups.map((chatGroup) => {
            return (
                chatGroup.id === chatGroupId
                    ? { ...chatGroup, title: e.target.value }
                    : chatGroup
            )
        })

        setChatGroups(editedChatGroups)
    }, [chatGroups])

    const [validationMessageOfTitle, setValidationMessageOfTitle] = useState('')

    /**
     * inputからフォーカスが外れた時にchatGroupのtitleの編集モードを解除
     */
    const outOfTitleInput = useCallback(() => {
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
        const editedChatGroups: ChatGroup[] = chatGroups.map((chatGroup) => {
            return { ...chatGroup, isEditingRename: false }
        })

        setChatGroups(editedChatGroups)
    }, [chatGroups])

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

    // 編集ボタン押下時にtitleのinputタグにフォーカスを自動で当てる
    useEffect(() => {
        chatGroupTitleInputRef.current?.focus()
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
        const chatGroups = initChatGroups(resChatGroups)

        setChatGroups(chatGroups)

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
            setChatGroupId('')
        }
    }

    /**
     * chatGroupsのページネーション押下時
     */
    const getChatGroupsPagination = async (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page)

        const resChatGroups = await getChatGroups(page)
        const chatGroups = initChatGroups(resChatGroups)

        setChatGroups(chatGroups)
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
                <SidebarContainer className={isSpMenuOpen ? 'open' : ''}>
                    <div className='contents'>
                        <NewChatButton
                            displayNewChat={displayNewChat}
                        />
                        <div className='past-chats-container'>
                            <SearchQuestionInput
                                searchChatGroups={searchChatGroups}
                            />
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
                                                            chatGroups={chatGroups}
                                                            chatGroup={chatGroup}
                                                            chatGroupId={chatGroupId}
                                                            displayPastChat={displayPastChat}
                                                            renameTitle={renameTitle}
                                                            outOfTitleInput={outOfTitleInput}
                                                            chatGroupTitleInputRef={chatGroupTitleInputRef}
                                                            convertTitleToInput={convertTitleToInput}
                                                            openDeleteModal={openDeleteModal}
                                                            displayPastChatMenu={displayPastChatMenu}
                                                            closePastChatMenu={closePastChatMenu}
                                                            validationMessageOfTitle={validationMessageOfTitle}
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
                        <div className='hoge'></div>
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
                </SidebarContainer>

                <MainContainer>
                    <Header>
                        <div className='select-box'>
                            <SelectBox isSelectManual={isSelectManual} setIsSelectManual={setIsSelectManual} manual={manual} setManual={setManual} />
                        </div>
                        <button className={ `hamburger ${ isSpMenuOpen ? 'open' : ''}` } onClick={openSpMenu}><span></span></button>
                    </Header>
                    <div className="messages" id="scroll-target">
                        {isChatLoading &&
                            <ChatLoading>
                                <CircularProgress disableShrink size={50}/>
                            </ChatLoading>
                        }
                        {chats.map((chat: Chat, i: number) => {
                            return (
                                <MessageContainer id={chat.id} key={i}>
                                    <UsersQuestion>
                                        <div className="icon"><FaceOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                                        <p className="text">
                                            <span className="name">You</span>
                                            {/* Fix::改行反映のため */}
                                            {chat.question.split("\n").map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>{item}<br /></React.Fragment>
                                                )
                                            })}
                                        </p>
                                    </UsersQuestion>
                                    {chat.isGenerating &&
                                        <Load>
                                            <CircularProgress disableShrink size={25}/>
                                            <p>回答を生成中です...</p>
                                        </Load>
                                    }
                                    {isDisplayChatGPT &&
                                        <AiAnswer>
                                            <div className='icon'><SmartToyOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                                            <div className="text">
                                                <span className="name">ChatGPT</span>
                                                {chat.answer}
                                                {chat.images &&
                                                    chat.images.map((image, i) => {
                                                        return (
                                                            <div className='img-container' key={i}>
                                                                <img src={image.url} className="img" alt="" />
                                                                <div className='img-text'>{image.name}</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {(!chat.isGenerating && (chat.pdfPages.length ? true : false)) &&
                                                    <div className='url-title'>
                                                        {`詳細は、${chat.documentName}ドキュメントの以下のページを参照してください。`}
                                                    </div>
                                                }
                                                {chat.pdfPages &&
                                                    chat.pdfPages.map((pdfPage: number, i: number) => {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                <div className='url'>
                                                                    ・<a target="_blank" href={`https://mel-document-public.s3.ap-northeast-1.amazonaws.com/${chat.documentName}.pdf#page=${pdfPage}`}>{pdfPage}ページ</a>
                                                                </div>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                                {!chat.isGenerating &&
                                                    <div className='checkbox-container'>
                                                        <CheckboxLabels
                                                            label={'この会話を次の質問に含める'}
                                                            handleChangeCheckbox={() => includeToHistory(chat, chats)}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </AiAnswer>
                                    }
                            </MessageContainer>)
                        })}
                    </div>

                    <FormContainer>
                        <div className='ta_c'>
                            <InputText
                                onChange={handleChangeInput}
                                value={inputQuestion}
                                placeholder='質問を入力してください。'
                                disabled={isLoading}
                                ref={textAreaRef}
                                style={{ height: textareaHeight && `${textareaHeight}px` }}
                            >
                            </InputText>
                            <InputText // 高さ計算用テキストエリア
                                ref={ invisibleTextAreaRef }
                                value={ inputQuestion }
                                onChange={ () => {} }
                                style={{ position: 'fixed', top: -999 }} // 見えない範囲へ移動
                            >
                            </InputText>

                            <SendButton onClick={sendQuestion}><SendIcon style={{ color: inputQuestion ? `${bgColor.blue}` : `${borderColor.gray}`}}/></SendButton>
                        </div>
                    </FormContainer>
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
  createRoot(element).render(<ChatMessage {...reactProps}/>)
}
