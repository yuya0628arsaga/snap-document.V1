import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import GoogleLoginButton from './components/GoogleLoginButton';
import CheckboxLabels from '../../components/Checkbox';
import { bgColor, borderColor, fontSize, fontWeight, textColor } from '../../utils/themeClient';
import { StatusCode } from '../../utils/statusCode';
import { FormHelperText } from '@mui/material';

const Wrapper = styled('div')`
    background: ${bgColor.lightBlue};
    height: 100vh;
    padding-top: 120px;

    display: flex;
    flex-direction: column;
    gap: 40px;
`

const LoginCard = styled('div')`
    width: 60%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
    background: ${bgColor.white};
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    > .google-login-button {
        width: 30%;
        margin: 0 auto;
        margin-top: 40px;
    }

    > .login-button {
        width: 30%;
        margin: 0 auto;
        margin-top: 40px;
    }

    > .error-message {
        margin: 0 auto;
        color: ${textColor.error};
        margin-top: 40px;
    }

    > .auto-login-checkbox {
        margin: 0 auto;
        margin-top: 24px;
    }

    > .link-group {
        margin: 0 auto;
        > .link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            > .text {
                color: ${textColor.linkBlue};
                font-size: 14px;
            }
        }
    }
`

const InputFormWrapper = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 60%;
    margin: 0 auto;
`

const InputForm = styled('div')`
`

const Title = styled('div')`
    margin: 0 auto;
    font-size: ${fontSize.xxxl};
    font-weight: ${fontWeight.bold};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
`

type UserLoginPropsType = {
    googleLoginUrl: string,
    appName: string,
}

const UserLogin = (props: UserLoginPropsType) => {
    const { googleLoginUrl, appName } = props

    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [failLoginErrorMessage, setFailLoginErrorMessage] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const successConsole = (message: string, result: any = null, color: string = 'green') => {
        console.log(`%c${message}: `, `color: ${color};`, result)
    }

    const errorConsole = (message: string, result: any = null, color: string = `${textColor.error}`) => {
        console.log(`%c${message}: `, `color: ${color};`, result)
    }

    const login = () => {

        if (email === '') {
            setEmailErrorMessage('メールアドレスは必ず指定してください。')
            return
        }

        if (password === '') {
            setPasswordErrorMessage('パスワードは必ず指定してください。')
            return
        }

        setFailLoginErrorMessage('')

        axios({
            method: 'POST',
            url: '/auth/login',
            params: {
                email: email,
                password: password,
            }
        })
        .then((res) => {
            console.log(res.data)
            successConsole('ログイン成功', res.data.intendedUrl)
            window.location.href = res.data.intendedUrl;
        })
        .catch((e: AxiosError) => {
            if (axios.isAxiosError(e) && e.response) {
                console.error(e)
                const { status, message } = e.response.data as { status: number, message: string }

                const errorMessages = {
                    [StatusCode.UNAUTHORIZED]: `${message}`,
                    [StatusCode.VALIDATION]: `${status}エラー： ${message}`,
                    [StatusCode.SERVER_ERROR]: 'サーバーとの通信に問題があり処理が失敗しました。再度お試し下さい。'
                } as any

                setFailLoginErrorMessage(errorMessages[status])
            } else {
                // general error
                console.error(e)
                setFailLoginErrorMessage('不具合のため処理が失敗しました。再度お試し下さい。')
            }
            errorConsole('ログイン失敗')
        })
    }

    return (
        <>
            <Wrapper>
                <Title>
                    <img src="/images/icon/logo.png" alt="" width={40} />
                    <div className='text'>{appName}</div>
                </Title>
                <LoginCard>
                    <InputFormWrapper>
                        <InputForm>
                            <TextField fullWidth label="メールアドレス"
                                size="medium"
                                error={emailErrorMessage !== ''}
                                type={'text'}
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value)
                                    setEmailErrorMessage('')
                                }}
                            />
                            {emailErrorMessage !== '' && <FormHelperText id="fullWidth" error={true}>{emailErrorMessage}</FormHelperText>}
                        </InputForm>

                        <InputForm>
                            <TextField fullWidth label="パスワード"
                                size="medium"
                                error={passwordErrorMessage !== ''}
                                type={'password'}
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.target.value)
                                    setPasswordErrorMessage('')
                                }}
                            />
                            {passwordErrorMessage !== '' && <FormHelperText id="fullWidth" error={true}>{passwordErrorMessage}</FormHelperText>}
                        </InputForm>
                    </InputFormWrapper>

                    {failLoginErrorMessage !== '' &&
                        <div className='error-message'>
                            {failLoginErrorMessage}
                        </div>
                    }

                    <div className='auto-login-checkbox'>
                        <CheckboxLabels
                            label={'次回から自動的にログインする'}
                            handleChangeCheckbox={() => console.log(333)}
                        />
                    </div>

                    <div className='link-group'>
                        <a href='#' className='link'>
                            <div className='text'>パスワードを忘れた方はこちらから</div>
                            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9.35315L6 5.35315L2 1.35315" stroke={`${textColor.linkBlue}`} />
                            </svg>
                        </a>
                        <a href='#' className='link'>
                            <div className='text'>新規登録はこちらから</div>
                            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9.35315L6 5.35315L2 1.35315" stroke={`${textColor.linkBlue}`} />
                            </svg>
                        </a>
                    </div>

                    <div className='login-button'>
                        <Button
                            variant="contained"
                            fullWidth
                            size='large'
                            sx={{
                                color: `${textColor.white}`,
                                background: `${bgColor.blue}`,
                            }}
                            onClick={login}
                        >
                            ログイン
                        </Button>
                    </div>

                    <div className='google-login-button'>
                        <GoogleLoginButton googleLoginUrl={googleLoginUrl} />
                    </div>

                </LoginCard>
            </Wrapper>
        </>
    )
}

export default UserLogin

const element = document.getElementById('user-login')
if (element) {
  const props = element.dataset.props
  const reactProps = props ? JSON.parse(props) : null
  createRoot(element).render(<UserLogin {...reactProps}/>)
}