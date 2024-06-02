import * as React from 'react';
import styled from "@emotion/styled"
import SendIcon from '@mui/icons-material/Send';
import { bgColor, borderColor, responsive } from '../../../utils/themeClient';

const QuestionInputWrapper = styled('div')`
    position: relative;
    text-align: center;
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
        background: ${bgColor.buttonGray};
    }
`

type QuestionInputPropsType = {
    inputQuestion: string,
    handleChangeInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    sendQuestion: () => void,
    isLoading: boolean,
}

const QuestionInput = (props: QuestionInputPropsType) => {
    const { inputQuestion, handleChangeInput, sendQuestion, isLoading } = props

    const SendButton = styled('button')`
        cursor: ${ (isLoading || !inputQuestion) && 'default'};
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10%;
    `

    const [ textareaHeight, setTextareaHeight ] = React.useState(0);
    const textAreaRef = React.useRef(null);
    const invisibleTextAreaRef = React.useRef<HTMLTextAreaElement>(null);

    // テキスト量に応じてtextareaの高さを自動調整する
    React.useEffect(() => {
    if (invisibleTextAreaRef.current) {
        const MAX_HEIGHT = 256
        if (invisibleTextAreaRef.current.scrollHeight >= MAX_HEIGHT) return;
        setTextareaHeight(invisibleTextAreaRef.current.scrollHeight);
    }
    }, [inputQuestion]);

    return (
        <QuestionInputWrapper>
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

            <SendButton onClick={sendQuestion}>
                <SendIcon style={{ color: inputQuestion ? `${bgColor.blue}` : `${borderColor.gray}` }} />
            </SendButton>
        </QuestionInputWrapper>
    )
}

export default QuestionInput