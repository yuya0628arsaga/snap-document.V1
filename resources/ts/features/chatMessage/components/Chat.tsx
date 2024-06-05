import styled from '@emotion/styled';
import * as React from 'react';
import { bgColor, borderColor, fontWeight, responsive } from '../../../utils/themeClient';
import { CircularProgress } from '@mui/material';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CheckboxLabels from '../../../components/Checkbox';
import { Chat as ChatType} from '../chatMessage';

const ChatWrapper = styled('div')`
    max-width: 60%;
    margin: 1% auto;
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

const AiAnswer = styled('div')`
    padding: 20px;
    background: ${bgColor.lightGray};
    display: flex;
    gap: 10px;
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

type ChatPropsType = {
    chat: ChatType,
    chats: ChatType[],
    isDisplayChatGPT: boolean,
    includeToHistory: (targetChat: ChatType, chats: ChatType[]) => void,
}

const Chat = (props: ChatPropsType) => {
    const { chat, chats, isDisplayChatGPT, includeToHistory } = props

    return (
        <ChatWrapper id={chat.id}>
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
                        {/* Fix::改行反映のため */}
                        {chat.answer.split("\n").map((item, index) => {
                            return (
                                <React.Fragment key={index}>{item}<br /></React.Fragment>
                            )
                        })}
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
        </ChatWrapper>
    )
}

export default Chat