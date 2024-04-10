import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontWeight } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SelectBox from '../../components/SelectBox';

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

const InputText = styled('input')`
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
    question: string,
    answer: string,
    isGenerating: boolean,
}

const ChatMessage = () => {

    const [inputQuestion, setInputQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [isDisplayQuestion, setIsDisplayQuestion] = useState(false)

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
        right: 8.5%;
    `

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputQuestion(e.target.value)
    }

    const postChats = (inputQuestion: string, manual: string, newChats: Chat[]): void => {
        axios({
            url: '/api/v1/chats/',
            method: 'POST',
            data: { question: inputQuestion, manualName: manual }
        })
        .then((res: AxiosResponse): void => {
            const { data } = res
            console.log(data.answer)

            const lastChat: Chat = newChats.slice(-1)[0];
            lastChat.answer = data.answer
            lastChat.isGenerating = false

            setChats(newChats)
        })
        .catch((e: AxiosError): void => {
            if (axios.isAxiosError(e) && e.response) {
                console.error(e)
                const data = e.response.data as {status: number, message: string}
                setErrorMessage('サーバーとの通信に問題があり処理が失敗しました。再度お試し下さい。')
            } else {
                // general error
                console.log(e)
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

        setErrorMessage('')

        const newChats: Chat[] = [...chats, { question: inputQuestion, answer: '', isGenerating: true }]
        setChats(newChats)

        setIsLoading(true)

        setIsDisplayQuestion(true)

        setIsDisplayChatGPT(true)

        postChats(inputQuestion, manual, chats)

        setInputQuestion('')
    }

    return (
        <>
            <Wrapper>
                <SidebarContainer>
                </SidebarContainer>

                <MainContainer>
                    <SelectBox isSelectManual={isSelectManual} setIsSelectManual={setIsSelectManual} manual={manual} setManual={setManual} />
                    <div className="messages">
                        {chats.map((chat: Chat, i: number) => {
                            return (<MessageContainer key={i}>
                                {isDisplayQuestion &&
                                    <UsersQuestion>
                                        <div className="icon"><FaceOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                                        <p className="text">
                                            <span className="name">You</span>
                                            { chat.question }
                                        </p>
                                    </UsersQuestion>
                                }
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
                            <InputText onChange={handleChangeInput} value={inputQuestion} className="test" type='text' placeholder='質問を入力してください。' disabled={isLoading}></InputText>
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
