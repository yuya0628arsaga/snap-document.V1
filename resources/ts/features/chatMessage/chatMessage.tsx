import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
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
// 検索フォーム
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { FiEdit, FiEdit3 } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

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
        flex: 1;
        overflow-y: scroll;
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
        &.open {
            right: 0;
        }
    }

    display: flex;
    flex-direction: column;
    >.contents {
        height: calc(100vh - 120px);
        width: 100%;
        >.new-chat-container {
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
        }
        >.past-chats-container {
            height: calc(100vh - 120px - 80px);
            display: flex;
            flex-direction: column;
            gap: 10px;

            // スクロールバー
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

            >.search {
                margin: 10px;
            }
            >.past-chats {
                display: flex;
                flex-direction: column;
                gap: 8px;
                >.date {
                    margin: 0 8px;
                    @media (max-width: ${responsive.sp}) {
                        text-align: center;
                    }
                }
                >.past-chat {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: ${bgColor.lightGray};
                    height: 70px;
                    padding: 8px;
                    position: relative;

                    > .past-chat-menu {
                        position: absolute;
                        width: 30%;
                        height: 50px;
                        background: ${bgColor.white};
                        top: 70%;
                        left: 70%;
                        z-index: 999;
                        display: none;
                        border: 1px solid ${borderColor.gray};
                        border-radius: 5px;
                        box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);

                        >.rename {
                            width: 100%;
                            height: 50%;
                            display: flex;
                            gap: 10px;
                            align-items: center;
                            padding: 0 8px;
                            cursor: pointer;
                            &:hover {
                                background: ${bgColor.buttonGray};
                            }
                            > p {
                                font-size: ${fontSize.sm};
                            }
                        }
                        >.delete {
                            width: 100%;
                            height: 50%;
                            display: flex;
                            gap: 10px;
                            align-items: center;
                            padding: 0 8px;
                            cursor: pointer;
                            &:hover {
                                background: ${bgColor.buttonGray};
                            }
                            > p {
                                font-size: ${fontSize.sm};
                            }
                        }
                    }
                    >.display {
                        display: block;
                    }

                    > button {
                        display: flex;
                        align-items: center;
                        gap: 5px;

                        background: ${bgColor.white};
                        padding: 5px 10px;
                        border: 1px solid ${borderColor.gray};
                        border-radius: 5px;
                        height: 100%;
                        width: 100%;

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
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        >.icon {
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            :hover {
                                border: 1px solid #EFF5F8;
                                background: #EFF5F8;
                            }
                            &.display {
                                border: 1px solid #EFF5F8;
                                background: #EFF5F8;
                            }
                        }
                    }

                    >.validation-message {
                        color: ${textColor.error};
                        font-size: ${fontSize.sm};
                    }
                }
            }
        }
    }
    >.account {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 20%;
        background: red;
        height: 120px;
        @media (max-width: ${responsive.sp}) {
            width: 0;
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
        background: #FFD700;
        border-radius: 5px;
        padding: 3px;
    }
    >.text {
        >.name {
            font-weight: ${fontWeight.bold};
            margin: 3px 0;
            display: block;
        }
    }
`

const Load = styled('div')`
    display: flex;
    gap: 10px;
    margin: 16px 0;
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
                margin: 0 auto;
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
            >.MuiFormGroup-root >.MuiFormControlLabel-root >.MuiTypography-root {
                margin-top: 3px;
            }
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
    base64Images: { path: string, base64: string }[],
    documentName: string,
    pdfPages: number[],
    isGenerating: boolean,
    isIncludeToHistory: boolean,
}

type ChatGroup = {
    id: string,
    title: string,
    lastChatDate: string,
    isActive: boolean,
    isDisplayPastChatMenu: boolean,
    isEditingRename: boolean,
}

type ResChatGroup = {
    [k in string]: ChatGroup[]
}

const ChatMessage = () => {

    const [inputQuestion, setInputQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [isDisplayChatGPT, setIsDisplayChatGPT] = useState(false)

    const [chats, setChats] = useState<Chat[]>([])
    const [chatGroupId, setChatGroupId] = useState<string | null>(null)

    const [manual, setManual] = React.useState('');
    const [isSelectManual, setIsSelectManual] = useState(true);

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
            data: { question: inputQuestion, manualName: manual, chatHistory: getChatHistory(chats), chatGroupId: chatGroupId }
            // data: { question: inputQuestion, manualName: manual, chatHistory: [['question1', 'answer1'], ['question2', 'answer2']] }
            // data: { question: '具体的にどの学部に行けばいいか教えてください。', manualName: manual, chatHistory: [['私は医者です。医者の平均収入を教えて下さい。', '医者の平均収入は、専門性や経験によって異なりますが、一般的には年間で数百万円から数千万円の間になることがあります。'], ['具体的にいくらですか？', '医者の平均収入は、専門性や経験によって異なりますが、一般的には年間で数百万円から数千万円の範囲になることがあります。例えば、一般開業医の場合、年収は1000万円以上になることが一般的です。特に専門医や大学病院の医師などは、それ以上の高収入を得ることもあります。']] }
        })
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data)

            const lastChat: Chat = newChats.slice(-1)[0];
            lastChat.answer = data.answer
            lastChat.base64Images = data.base64Images
            lastChat.pdfPages = data.pdfPages
            lastChat.isGenerating = false

            setChats(newChats)
            setChatGroupId(data.chatGroupId)
            if (!chatGroupId) getChatGroups() // chatGroupで一番最初の質問だった場合サイドバーのchatGroup更新
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
        if (isLoading || !inputQuestion) return;
        if (manual === '') {
            setIsSelectManual(false)
            return;
        }
        // エラーメッセージを空に
        setErrorMessage('')

        // const elementId = crypto.randomUUID();
        const elementId = Math.random().toString(36).slice(-8);
        const newChats: Chat[] = [...chats, { id: elementId, question: inputQuestion, answer: '', base64Images: [], documentName: manual, pdfPages: [], isGenerating: true , isIncludeToHistory: false}]
        setChats(newChats)

        // ローディング表示
        setIsLoading(true)

        // GPTのアイコン表示
        setIsDisplayChatGPT(true)

        // API通信
        postChats(inputQuestion, manual, newChats, chats, chatGroupId)

        // 質問入力欄を空に
        setInputQuestion('')

        // 質問があったchatGroupをサイドバーのトップに移動
        if (chatGroupId) {
            const chatGroupsCopy = { ...chatGroups }
            const sortedChatGroups = sortChatGroups(chatGroupsCopy)
            setChatGroups(sortedChatGroups)
        }
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


    const [chatGroups, setChatGroups] = useState<ResChatGroup[]>([])

    useEffect(() => {
        (async (): Promise<void> => {
            const chatGroups = await getChatGroups()
            setChatGroups(chatGroups)
        })()
    }, [])

    /**
     * サーバからチャットグループを取得
     */
    const getChatGroups = (): Promise<ResChatGroup[]> => {
        return new Promise((resolve, reject) => {
            axios({
                url: '/api/v1/chat-groups/',
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
    const getChats = (chatGroupId: string): void => {
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

            // [{ id: elementId, question: inputQuestion, answer: '', base64Images: [], documentName: manual, pdfPages: [], isGenerating: true , isIncludeToHistory: false}, {...}, {...}]
            setChats(data)
            setChatGroupId(chatGroupId)
            setIsDisplayChatGPT(true)
            setIsSpMenuOpen(prev => !prev)
        })
        .catch((e: AxiosError): void => {
            console.error(e)
        })
    }


    /**
     * 質問を検索
     */
    const searchChatGroups = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchWord: string = e.target.value
        const chatGroups: ResChatGroup[] = await getChatGroups()
        const searchedChatGroups: ResChatGroup[] = []

        Object.keys(chatGroups).map((date) => {
            const filteredChangeGroup = chatGroups[date].filter((chatGroup) => {
                const isMatch = chatGroup.title.indexOf(searchWord) !== -1
                return isMatch
            })
            searchedChatGroups[date] = filteredChangeGroup
        })

        setChatGroups(searchedChatGroups)
    }

    /**
     * 過去の質問を表示
     */
    const displayPastChat = async (chatGroup: ChatGroup) => {
        const isEditingRename = chatGroup.isEditingRename  // title編集中はイベント発火させない
        const chatGroupId = chatGroup.id
        if (isEditingRename) return

        getChats(chatGroupId)

        const chatGroups = await getChatGroups()
        const newChatGroups: ResChatGroup[] = []

        // isActiveを切り替える
        Object.keys(chatGroups).map((date) => {
            const includeIsActiveChatGroup = chatGroups[date].map((chatGroup: ChatGroup) => {
                chatGroup.isActive =
                    chatGroup.id === chatGroupId
                    ? true
                    : false

                return chatGroup
            })

            newChatGroups[date] = includeIsActiveChatGroup
        })

        setChatGroups(newChatGroups)
    }

    /**
     * 新しい質問を開始
     */
    const displayNewChat = async () => {
        setChats([])
        setChatGroupId('')

        const chatGroups = await getChatGroups()
        setChatGroups(chatGroups)
    }

    // ポップアップメニューが表示中か否か
    const [displayingPastChatMenu, setDisplayingPastChatMenu] = useState(false)

    /**
     * pastChatのポップアップメニューを開く
     */
    const displayPastChatMenu = (e, chatGroupId: string) => {
        e.stopPropagation()
        setDisplayingPastChatMenu(true)
        const newChatGroups: ResChatGroup[] = []

        // isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を切り替える
        Object.keys(chatGroups).map((date) => {
            const includeIsActiveChatGroup = chatGroups[date].map((chatGroup: ChatGroup) => {
                chatGroup.isDisplayPastChatMenu =
                        chatGroup.id === chatGroupId
                            ? true
                            : false

                return chatGroup
            })

            newChatGroups[date] = includeIsActiveChatGroup
        })

        setChatGroups(newChatGroups)
    }

    /**
     * pastChatのポップアップメニューを閉じる
     */
    const closePastChatMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // MEMO::なぜかref.current.contains()が使えなかったためこのように実装した
        const isClickedPostChatMenuElement = e.target.classList[0] === 'past-chat-menu'
        if (isClickedPostChatMenuElement) return
        if (!displayingPastChatMenu) return

        const newChatGroups: ResChatGroup[] = []

        // isDisplayPastChatMenu（ポップアップメニューの表示フラグ）を全てfalseにする
        Object.keys(chatGroups).map((date) => {
            const includeIsActiveChatGroup = chatGroups[date].map((chatGroup: ChatGroup) => {
                chatGroup.isDisplayPastChatMenu = false
                return chatGroup
            })

            newChatGroups[date] = includeIsActiveChatGroup
        })

        setChatGroups(newChatGroups)
        setDisplayingPastChatMenu(false)
    }

    const chatGroupTitleInputRef = useRef(null)

    /**
     * titleをinputタグに変換する
     */
    const convertTitleToInput = (chatGroupId: string) => {
        const newChatGroups: ResChatGroup[] = []

        // isEditingRename（title編集中フラグ）を切り替える
        Object.keys(chatGroups).map((date) => {
            const includeIsActiveChatGroup = chatGroups[date].map((chatGroup: ChatGroup) => {
                chatGroup.isEditingRename =
                        chatGroup.id === chatGroupId
                            ? true
                            : false

                return chatGroup
            })

            newChatGroups[date] = includeIsActiveChatGroup
        })

        setChatGroups(newChatGroups)
    }

    /**
     * chatGroupのtitle名を修正する
     */
    const renameTitle = (e: ChangeEvent<HTMLInputElement>, chatGroupId: string) => {
        const newChatGroups: ResChatGroup[] = []

        // titleの更新
        Object.keys(chatGroups).map((date) => {
            const includeIsActiveChatGroup = chatGroups[date].map((chatGroup: ChatGroup) => {
                if (chatGroup.id === chatGroupId) {
                    chatGroup.title = e.target.value
                }

                return chatGroup
            })

            newChatGroups[date] = includeIsActiveChatGroup
        })

        setChatGroups(newChatGroups)
    }

    const [validationMessageOfTitle, setValidationMessageOfTitle] = useState('')

    /**
     * inputからフォーカスが外れた時にchatGroupのtitleの編集モードを解除
     */
    const outOfTitleInput = () => {
        const chatGroupId = chatGroupTitleInputRef.current.id
        const title = chatGroupTitleInputRef.current.value
        const MAX_STR_COUNT = 255

        if (!title || title.length > MAX_STR_COUNT) {
            setValidationMessageOfTitle('1~255文字以内で入力してください。')
            return
        }
        // titleのupdate（サーバー）
        updateChatGroupTitle(chatGroupId, title)


        const newChatGroups: ResChatGroup[] = []

        // isEditingRename（title編集中フラグ）を元に戻す
        Object.keys(chatGroups).map((date) => {
            const includeIsActiveChatGroup = chatGroups[date].map((chatGroup: ChatGroup) => {
                chatGroup.isEditingRename = false
                return chatGroup
            })

            newChatGroups[date] = includeIsActiveChatGroup
        })

        setChatGroups(newChatGroups)
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
    const openDeleteModal = (chatGroupId: string, chatGroupTitle: string) => {
        // 削除対象のchatGroupId
        setDeleteTargetChatGroupId(chatGroupId)

        const modalDescriptionMessage = `${chatGroupTitle} を削除しますか？`
        setModalDescription(modalDescriptionMessage)
        setIsOpenDeleteModal(true)
    }

    /**
     * chatGroupを削除しサイドバー更新
     */
    const executeDelete = async (deleteTargetChatGroupId: string, currentlyOpenChatGroupId: string) => {
        await deleteChatGroup(deleteTargetChatGroupId)

        const chatGroups: ResChatGroup[] = await getChatGroups()
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
    const refreshChats = (deletedChatGroupId: string, currentlyOpenChatGroupId: string) => {
        if (deleteTargetChatGroupId === currentlyOpenChatGroupId) {
            setChats([])
            setChatGroupId('')
        }
    }

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
            <Wrapper onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {closePastChatMenu(e)}}>
                <SidebarContainer className={isSpMenuOpen ? 'open' : ''}>
                    <div className='contents'>
                        <div className='new-chat-container'>
                            <div onClick={displayNewChat} className='new-chat-button'>
                                <div className='img'>
                                    <img src="/images/icon/logo.png" alt=""/>
                                </div>
                                <div className='text'>New Chat</div>
                                <div className='icon'><FiEdit /></div>
                            </div>
                        </div>
                        <div className='past-chats-container'>
                            <div className='search'>
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
                            </div>

                            <div className='past-chats'>
                                {Object.keys(chatGroups).map((date: string, i: number) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <div className='date'>
                                                {date}
                                            </div>
                                            {chatGroups[date].map((chatGroup: ChatGroup, i: number) => {
                                                return (
                                                    <div key={i} className='past-chat'>
                                                        <button className={ chatGroup.isActive ? 'active' : ''}>
                                                            <div className='text' onClick={() => { displayPastChat(chatGroup) }}>
                                                                {chatGroup.isEditingRename
                                                                    ? <input type="text" id={chatGroup.id} value={chatGroup.title} onChange={(e: ChangeEvent<HTMLInputElement>) => { renameTitle(e, chatGroup.id) }} onBlur={outOfTitleInput} ref={chatGroupTitleInputRef} />
                                                                    : chatGroup.title
                                                                }
                                                            </div>
                                                            <div className={`icon ${chatGroup.isDisplayPastChatMenu ? 'display' : ''}`} onClick={(e) => { displayPastChatMenu(e, chatGroup.id) }}>
                                                                <svg width="3" height="14" viewBox="0 0 3 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="1.5" cy="2" r="1.5" transform="rotate(90 1.5 2)" fill={chatGroup.isDisplayPastChatMenu ? '#2F80ED' : 'gray'} />
                                                                    <circle cx="1.5" cy="7" r="1.5" transform="rotate(90 1.5 7)" fill={chatGroup.isDisplayPastChatMenu ? '#2F80ED' : 'gray'}/>
                                                                    <circle cx="1.5" cy="12" r="1.5" transform="rotate(90 1.5 12)" fill={chatGroup.isDisplayPastChatMenu ? '#2F80ED' : 'gray'}/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                        {(chatGroup.isEditingRename && validationMessageOfTitle) &&
                                                            <div className='validation-message'>{validationMessageOfTitle}</div>
                                                        }
                                                        <div className={`past-chat-menu ${chatGroup.isDisplayPastChatMenu ? 'display' : ''}`}>
                                                            <div className='rename' onClick={() => {convertTitleToInput(chatGroup.id)}}>
                                                                <FiEdit3 />
                                                                <p>編集</p>
                                                            </div>
                                                            <div className='delete' onClick={() => {openDeleteModal(chatGroup.id, chatGroup.title)}}>
                                                                <RiDeleteBin5Line />
                                                                <p>削除</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </React.Fragment>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                    <div className='account'></div>
                </SidebarContainer>

                <MainContainer>
                    <Header>
                        <div className='select-box'>
                            <SelectBox isSelectManual={isSelectManual} setIsSelectManual={setIsSelectManual} manual={manual} setManual={setManual} />
                        </div>
                        <button className={ `hamburger ${ isSpMenuOpen ? 'open' : ''}` } onClick={openSpMenu}><span></span></button>
                    </Header>
                    <div className="messages" id="scroll-target">
                        {chats.map((chat: Chat, i: number) => {
                            return (<MessageContainer id={chat.id} key={i}>
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
                                            {chat.base64Images &&
                                                chat.base64Images.map((base64Image, i) => {
                                                    return (
                                                        <div className='img-container' key={i}>
                                                            <img src={`data:image/jpg;base64,${base64Image.base64}`} className="img" alt="" />
                                                            <div className='img-text'>{base64Image.path}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {(!chat.isGenerating && chat.pdfPages) &&
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
                                                        targetChat={chat}
                                                        chats={chats}
                                                        includeToHistory={includeToHistory}
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
                            <div className='error-message'>{errorMessage}</div>
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
