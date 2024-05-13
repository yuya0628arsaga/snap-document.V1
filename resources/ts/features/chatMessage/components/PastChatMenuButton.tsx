import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled from '@emotion/styled';
import { bgColor, fontSize } from '../../../utils/themeClient';
import { FiEdit3 } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ChatGroup } from '../chatMessage';


const PastChatMenuWrapper = styled('div')``

const PastChatMenu = styled('div')`
    >.rename {
        width: 100%;
        height: 50%;
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 0 8px;
        cursor: pointer;
        &:hover {
            background: ${bgColor.buttonGray};
        }
        > p {
            font-size: ${fontSize.sm};
        }
    }
    >.delete {
        width: 100%;
        height: 50%;
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 0 8px;
        cursor: pointer;
        &:hover {
            background: ${bgColor.buttonGray};
        }
        > p {
            font-size: ${fontSize.sm};
        }
    }
`

type PastChatMenuButtonPropsType = {
    chatGroup: ChatGroup,
    convertTitleToInput: (chatGroupId: string) => void,
    openDeleteModal: (chatGroupId: string, chatGroupTitle: string) => void,
}

export default function PastChatMenuButton(props: PastChatMenuButtonPropsType) {
    const { chatGroup, convertTitleToInput, openDeleteModal } = props
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <PastChatMenuWrapper>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className='test'
            >
                <PastChatMenu>
                    <div className='rename' onClick={() => {
                        convertTitleToInput(chatGroup.id)
                        handleClose()
                    }}>
                        <FiEdit3 />
                        <p>編集</p>
                    </div>
                    <div className='delete' onClick={() => {
                        openDeleteModal(chatGroup.id, chatGroup.title)
                        handleClose()
                    }}>
                        <RiDeleteBin5Line />
                        <p>削除</p>
                    </div>
                </PastChatMenu>
            </Menu>
        </PastChatMenuWrapper>
    );
}