import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontWeight } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SelectBox from '../../components/SelectBox';
import { StatusCode } from '../../utils/statusCode';

const Wrapper = styled('div')`
    display: flex;
`

const MainContainer = styled('div')`
    /* background: green; */
    flex-grow: 8;
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
    flex-grow: 2;
    min-width: 220px;
    height: 100vh;
    background: yellow;
`

const MessageContainer = styled('div')`
    max-width: 60%;
    margin: 1% auto;
    /* height: 80vh; */
    overflow-y: scroll;
    ::-webkit-scrollbar {
        display:none;
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
    isGenerating: boolean,
}

const ChatMessage = () => {

    const [inputQuestion, setInputQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [isDisplayChatGPT, setIsDisplayChatGPT] = useState(false)

    const [chats, setChats] = useState<Chat[]>([])

    const [manual, setManual] = React.useState('');
    const [isSelectManual, setIsSelectManual] = useState(true);

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
     * サーバに質問を投げて回答を取得
     */
    const postChats = (inputQuestion: string, manual: string, newChats: Chat[]): void => {
        axios({
            url: '/api/v1/chats/',
            method: 'POST',
            data: { question: inputQuestion, manualName: manual }
        })
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data)

            const lastChat: Chat = newChats.slice(-1)[0];
            lastChat.answer = data.answer
            lastChat.isGenerating = false

            setChats(newChats)
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

        const elementId = crypto.randomUUID();
        const newChats: Chat[] = [...chats, { id: elementId, question: inputQuestion, answer: '', isGenerating: true }]
        setChats(newChats)

        // ローディング表示
        setIsLoading(true)

        // GPTのアイコン表示
        setIsDisplayChatGPT(true)

        // API通信
        postChats(inputQuestion, manual, newChats)

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
        autoScroll()
    }, [chats])

    return (
        <>
            <Wrapper>
                <SidebarContainer>
                </SidebarContainer>

                <MainContainer>
                    <SelectBox isSelectManual={isSelectManual} setIsSelectManual={setIsSelectManual} manual={manual} setManual={setManual} />
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
                                        <p className="text">
                                            <span className="name">ChatGPT</span>
                                            { chat.answer }
                                        </p>
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
