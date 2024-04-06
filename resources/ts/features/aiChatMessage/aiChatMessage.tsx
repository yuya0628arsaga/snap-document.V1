import axios from 'axios';
import { createRoot } from 'react-dom/client'
import React from 'react'
import styled from '@emotion/styled'
import { bgColor, borderColor, fontWeight } from '../../utils/themeClient';
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
        }
    }
`

const Load = styled('div')`
`

const AiAnswer = styled('div')`
    padding: 20px;
    background: ${bgColor.lightGray};
    display: flex;
    gap: 10px;
    border-radius: 5px;
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
        }
    }
`

const FormContainer = styled('div')`
    /* background: blue; */
    margin: 50px;
`
const QuestionForm = styled('form')`
    text-align: center;
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

    const fetch = () => {
        axios.get('http://localhost:80/api/test').then((res) => {
            console.log(res.data)
        })
    }

    const handleClick = () => {
        console.log(121212)
        fetch()
    }



    return (
        <>
            <Wrapper>
                <SidebarContainer>
                </SidebarContainer>

                <MainContainer>
                    <button onClick={handleClick}>ボタン</button>
                    <MessageContainer>
                        <UsersQuestion>
                            <div className="icon"><FaceOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                            <p className="text">
                                <div className="name">You</div>
                                回路エディタで素子を選択するにはどうしたらいいですか？
                                Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                            </p>
                        </UsersQuestion>
                        <Load>
                            <p>回答を生成中です...</p>
                        </Load>
                        <AiAnswer>
                            <div className='icon'><SmartToyOutlinedIcon style={{ color: `${borderColor.white}` }} /></div>
                            <p className="text">
                                <div className="name">ChatGPT</div>
                                Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                                Browse through the icons below to find the one you need. The search field supports synonyms—for example, try searching for "hamburger" or "logout."
                            </p>
                        </AiAnswer>

                    </MessageContainer>

                    <FormContainer>
                        <QuestionForm>
                            <InputText className="test" type='text' placeholder='質問を入力してください。'></InputText>
                            <SendButton type="submit"><SendIcon /></SendButton>
                        </QuestionForm>
                    </FormContainer>
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
