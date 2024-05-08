import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaRegUserCircle } from "react-icons/fa";
import styled from '@emotion/styled';
import { bgColor } from '../../../utils/themeClient';
import { fontSize } from '../../../utils/themeClient';
import { fontWeight } from '../../../utils/themeClient';

const AccountButton = styled('button')`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px;
    width: 85%;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    :hover {
        background: ${bgColor.buttonGray};
    }
    >.user-icon {}
    >.user-name {
        font-size: ${fontSize.lg};
        font-weight: ${fontWeight.normal};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

const AccountPopupMenuButton = (props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AccountButton
                onClick={handleClick}
            >
                <div className='user-icon'>
                    <FaRegUserCircle style={{fontSize: '28px'}}/>
                </div>
                <div className='user-name'>
                    ゲスト
                </div>
            </AccountButton>
            <Menu
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>settings</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </>
    );
}

export default AccountPopupMenuButton