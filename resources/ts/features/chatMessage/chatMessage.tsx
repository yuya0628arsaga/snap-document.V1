import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontWeight, responsive } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SelectBox from '../../components/SelectBox';
import { StatusCode } from '../../utils/statusCode';
import CheckboxLabels from '../../components/Checkbox';
// 検索フォーム
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

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
`

const SidebarContainer = styled('div')`
    /* flex-grow: 2; */
    /* min-width: 220px; */
    width: 20%;
    height: 100vh;
    /* background: yellow; */
    background: ${bgColor.lightGray};
    @media (max-width: ${responsive.sp}) {
        background: ${borderColor.blue};
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
        >.new-chat-button {
            background: blue;
            height: 80px;
            width: 100%;
        }
        >.past-chats-container {
            height: calc(100vh - 120px - 80px);
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow-y: scroll;

            >.search {
                margin: 10px;
            }
            >.past-chats {
                display: flex;
                flex-direction: column;
                gap: 16px;
                >.date {
                    margin: 0 8px;
                }
                >.past-chat {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: ${bgColor.lightGray};
                    height: 50px;
                    padding: 8px;

                    > button {
                        background: lightblue;
                        padding: 10px;
                        border: 1px solid ${borderColor.gray};
                        border-radius: 5px;
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
    position: relative;
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
`

const ErrorMessageContainer = styled('div')`
    padding: 24px;
    text-align: center;
    > .error-message {
        color: red;
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
}

type ResChatGroup = {
    [key: string]: ChatGroup[]
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
        getChatGroups()
    }, [])

    /**
     * サーバからチャットグループを取得
     */
    const getChatGroups = (): void => {
        axios({
            url: '/api/v1/chat-groups/',
            method: 'GET',
        })
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data)

            setChatGroups(data)
        })
        .catch((e: AxiosError): void => {
            console.error(e)
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
        })
        .catch((e: AxiosError): void => {
            console.error(e)
        })
    }


    return (
        <>
            <Wrapper>
                <SidebarContainer className={isSpMenuOpen ? 'open' : ''}>
                    <div className='contents'>
                        <div className='new-chat-button'></div>
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
                                        inputProps={{ 'aria-label': 'search google maps' }}
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
                                                        <button onClick={() => {getChats(chatGroup.id)}}>
                                                            {chatGroup.title}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </React.Fragment>
                                    )
                                })}
                                <div className='date'>
                                    2024年1月
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                            </div>

                            <div className='past-chats'>
                                <div className='date'>
                                    2024年2月
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
                                <div className='past-chat'>
                                    <button>
                                        質問タイトル１
                                    </button>
                                </div>
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

                    <div className='m_48'>
                        <FormContainer className='ta_c'>
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
                        </FormContainer>
                    </div>
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
