import axios from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontWeight } from '../../utils/themeClient';
import CircularProgress from '@mui/material/CircularProgress';

import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
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
`

const SidebarContainer = styled('div')`
    flex-grow: 2;
    min-width: 220px;
    height: 100vh;
    background: yellow;
`
const MessageContainer = styled('div')`
    max-width: 80%;
    margin: 0 10%;
    height: 80vh;
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

const SendButton = styled('button')`
`
const InputText = styled('input')`
    background: ${bgColor.lightGray};
    border: 1px solid ${borderColor.gray};
    border-radius: 5px;
    height: 40px;
    width: 85%;
    padding: 8px;
    :focus {
        border-color: ${borderColor.blue};
    }
`
const AiChatMessage = (props) => {

    const [inputQuestion, setInputQuestion] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const [displayedQuestion, setDisplayedQuestion] = useState('')
    const [isDisplayQuestion, setIsDisplayQuestion] = useState(false)

    const [answer, setAnswer] = useState('')
    const [isDisplayChatGPT, setIsDisplayChatGPT] = useState(false)

    const fetch = () => {
        axios.get('http://localhost:80/api/test').then((res) => {
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
        setIsGenerating(true)

        setIsDisplayQuestion(true)
        setDisplayedQuestion(inputQuestion)

        setInputQuestion('')

        setIsDisplayChatGPT(true)

        axios.get('http://localhost:80/api/aaa').then((res) => {
            console.log(res.data['message'])
            setAnswer(res.data['message'])
            setIsGenerating(false)
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
                    <button onClick={handleClick}>ボタン</button>
                    <MessageContainer>
                        {isDisplayQuestion &&
                            <UsersQuestion>
                                <div className="icon"><FaceOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                                <p className="text">
                                    <span className="name">You</span>
                                    {/* 回路エディタで素子を選択するにはどうしたらいいですか？
                                    Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout." */}
                                    { displayedQuestion }
                                </p>
                            </UsersQuestion>
                        }
                        {isGenerating &&
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
                                    { answer }
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

                    </MessageContainer>

                    <div className='m_48'>
                        <div className='ta_c'>
                            <InputText onChange={handleChangeInput} value={inputQuestion} className="test" type='text' placeholder='質問を入力してください。'></InputText>
                            <SendButton onClick={sendQuestion}><SendIcon /></SendButton>
                        </div>
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
