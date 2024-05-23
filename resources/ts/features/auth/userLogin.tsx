import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import GoogleLoginButton from './components/GoogleLoginButton';
import CheckboxLabels from '../../components/Checkbox';
import { bgColor, borderColor, textColor } from '../../utils/themeClient';

const Wrapper = styled('div')`
    /* display: flex;
    justify-content: center;
    flex-direction: column; */

    /* background: red; */
    background: #F4F7FA;
    height: 100vh;
    padding-top: 40px;
`

const LoginCard = styled('div')`
    /* padding: 100px; */
    width: 60%;
    /* height: 600px; */
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;

    /* padding: 40px, 0px, 40px, 0px; */

    background: #fff;
    padding: 40px;
    padding-top: 64px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    /* background: lawngreen; */

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
                color: #3D89E4;
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
    /* background: yellow; */
`

const InputForm = styled('div')`
`

type UserLoginPropsType = {
    googleLoginUrl: string
}

const UserLogin = (props: UserLoginPropsType) => {
    const { googleLoginUrl } = props

    return (
        <>
            <Wrapper>
                <LoginCard>
                    <InputFormWrapper>
                        <InputForm>
                            <TextField fullWidth label="メールアドレス" id="fullWidth" size="small" error={false} type={'text'}/>
                            {/* <FormHelperText id="fullWidth" error={false}>Error</FormHelperText> */}
                        </InputForm>

                        <InputForm>
                            <TextField fullWidth label="パスワード" id="fullWidth" size="small" error={false} type={'text'}/>
                            {/* <FormHelperText id="fullWidth" error={false}>Error</FormHelperText> */}
                        </InputForm>
                    </InputFormWrapper>

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
                                <path d="M2 9.35315L6 5.35315L2 1.35315" stroke="#3D89E4" />
                            </svg>
                        </a>
                        <a href='#' className='link'>
                            <div className='text'>新規登録はこちらから</div>
                            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9.35315L6 5.35315L2 1.35315" stroke="#3D89E4" />
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
