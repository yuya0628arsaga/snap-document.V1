import axios from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontWeight } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

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
    max-width: 80%;
    margin: 5% 10%;
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

const AiChatMessage = (props) => {

    const [inputQuestion, setInputQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [isDisplayQuestion, setIsDisplayQuestion] = useState(false)

    const [isDisplayChatGPT, setIsDisplayChatGPT] = useState(false)

    const [qAndAObjs, setQandAObjs] = useState([])

    const SendButton = styled('button')`
        cursor: ${ (isLoading || !inputQuestion) && 'default'};
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8.5%;
    `

    const fetch = () => {
        axios.get('http://user.localhost:80/api/v1/test').then((res) => {
            console.log(res.data)
        })
    }

    const handleClick = () => {
        console.log(121212)
        fetch()
    }

    const handleChangeInput = (e) => {
        setInputQuestion(e.target.value)
    }

    const sendQuestion = () => {
        // const latestQAndAObjs = qAndAObjs.slice(-1)[0];
        if (isLoading || !inputQuestion) return;

        const newQAndAObjs = [...qAndAObjs, { question: inputQuestion, answer: '', isGenerating: true }]

        setQandAObjs(newQAndAObjs)

        setIsLoading(true)

        setIsDisplayQuestion(true)

        // const newDisplayedQuestions = [...displayedQuestions, inputQuestion]
        // setDisplayedQuestions([...displayedQuestions, inputQuestion])

        setInputQuestion('')

        setIsDisplayChatGPT(true)

        axios.get('/api/v1/test').then((res) => {
            console.log(res.data['message'])
            // setAnswer(res.data['message'])
            const lastQandA = newQAndAObjs.slice(-1)[0];
            lastQandA.answer = res.data['message']
            lastQandA.isGenerating = false

            setQandAObjs(newQAndAObjs)

            setIsLoading(false)
        })

        console.log(7777)
        console.log(inputQuestion)

        // setTimeout(() => {
        //     setIsGenerating(false)
        // }, 3000)

    }


    return (
        <>
            <Wrapper>
                <SidebarContainer>
                </SidebarContainer>

                <MainContainer>
                    <div className="messages">
                        {/* <button onClick={handleClick}>ボタン</button> */}
                        {qAndAObjs.map((qAndA, i) => {
                            return (<MessageContainer key={i}>
                                {isDisplayQuestion &&
                                    <UsersQuestion>
                                        <div className="icon"><FaceOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                                        <p className="text">
                                            <span className="name">You</span>
                                            {/* 回路エディタで素子を選択するにはどうしたらいいですか？
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout." */}
                                            { qAndA.question }
                                        </p>
                                    </UsersQuestion>
                                }
                                {qAndA.isGenerating &&
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
                                            { qAndA.answer }
                                            {/* Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                            Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout." */}
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

                </MainContainer>
            </Wrapper>
        </>
    )
}

export default AiChatMessage

const element = document.getElementById('ai-chat-message')
if (element) {
  const props = element.dataset.props
  const reactProps = props ? JSON.parse(props) : null
  createRoot(element).render(<AiChatMessage {...reactProps}/>)
}
