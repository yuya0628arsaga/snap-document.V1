import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { AccountCircle } from '@mui/icons-material';
import AccountSettingsModal, { setIsGetPdfPageParam } from './AccountSettingsModal';
import axios, { AxiosResponse } from 'axios';
import styled from '@emotion/styled';

const AccountMenuButtonWrapper = styled('div')`
    margin-right: 16px;
`

type AccountMenuButtonPropsType = {
    isGetPdfPage: boolean,
    setIsGetPdfPage: (isGetPdfPage: setIsGetPdfPageParam) => void,
    gptModel: string,
    setGptModel: (gptModel: string) => void,
    avatarUrl: string,
}

const AccountMenuButton = React.memo((props: AccountMenuButtonPropsType) => {
    const { isGetPdfPage, setIsGetPdfPage, gptModel, setGptModel, avatarUrl } = props

    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    /**
     * ログアウト処理
     */
    const logout = () => {
        axios({
            url: '/auth/logout',
            method: 'GET',
        })
        .then((res: AxiosResponse) => {
            console.log(res.data.redirectUrl)
            window.location.href = res.data.redirectUrl;
        })
    }

    const menuPaperProps = {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
            },
            '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            },
        },
    }


    return (
        <AccountMenuButtonWrapper>
            <Tooltip title="アカウント設定">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                >
                    <Avatar src={avatarUrl ?? ''} sx={{ width: 40, height: 40 }} />
                </IconButton>
            </Tooltip>
            <AccountSettingsModal
                open={isSettingsModalOpen}
                setOpen={setIsSettingsModalOpen}
                isGetPdfPage={isGetPdfPage}
                setIsGetPdfPage={setIsGetPdfPage}
                gptModel={gptModel}
                setGptModel={setGptModel}
            />

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={menuPaperProps}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <AccountCircle fontSize="medium" />
                    </ListItemIcon>
                    プロフィール
                </MenuItem>

                <MenuItem onClick={() => {
                    handleClose()
                    setIsSettingsModalOpen(true)
                }}>
                    <ListItemIcon>
                        <Settings fontSize="medium" />
                    </ListItemIcon>
                    設定
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    logout()
                    handleClose()
                }}>
                    <ListItemIcon>
                        <Logout fontSize="medium" />
                    </ListItemIcon>
                    ログアウト
                </MenuItem>
            </Menu>
        </AccountMenuButtonWrapper>
    );
})

export default AccountMenuButton