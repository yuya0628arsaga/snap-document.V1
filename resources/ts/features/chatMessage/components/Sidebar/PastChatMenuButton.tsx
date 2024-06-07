import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled from '@emotion/styled';
import { bgColor, fontSize, textColor } from '../../../../utils/themeClient';
import { FiEdit3 } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ChatGroup } from '../../chatMessage';
import { IconContext } from "react-icons" // iconにデザイン適用させるため
import { toggleIsEditingRename } from '../../store/modules/chatGroups';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';


const PastChatMenuWrapper = styled('div')``

const PastChatMenu = styled('div')`
    >.rename {
        width: 100%;
        height: 50%;
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 5px 15px;
        cursor: pointer;
        &:hover {
            background: ${bgColor.buttonGray};
        }
        > p {
            font-size: ${fontSize.md};
        }
    }
    >.delete {
        width: 100%;
        height: 50%;
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 5px 15px;
        cursor: pointer;
        &:hover {
            background: ${bgColor.buttonGray};
        }
        > p {
            font-size: ${fontSize.md};
            color: ${textColor.error};
        }
    }
`

type PastChatMenuButtonPropsType = {
    chatGroup: ChatGroup,
    openDeleteModal: (chatGroupId: string, chatGroupTitle: string) => void,
    displayPastChatMenu: (chatGroupId: string) => void,
    closePastChatMenu: () => void,
}

const PastChatMenuButton = React.memo((props: PastChatMenuButtonPropsType) => {
    const { chatGroup, openDeleteModal, displayPastChatMenu, closePastChatMenu } = props
    const dispatch = useDispatch<AppDispatch>();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        closePastChatMenu()
        setAnchorEl(null);
    };

    /**
     * titleをinputタグに変換する
     */
    const convertTitleToInput = (chatGroupId: string) => {
        // isEditingRename（title編集中フラグ）を切り替える
        dispatch(toggleIsEditingRename(chatGroupId))
    }

    console.log(222222)

    return (
        <PastChatMenuWrapper>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={(e) => {
                    displayPastChatMenu(chatGroup.id)
                    handleClick(e)
                }}
                color={ `${chatGroup.isDisplayPastChatMenu ? 'primary' : 'inherit'}` }
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
            >
                <PastChatMenu>
                    <div className='rename' onClick={() => {
                        convertTitleToInput(chatGroup.id)
                        handleClose()
                    }}>
                        <IconContext.Provider value={{ size: '20px' }}>
                            <FiEdit3 fontSize={'large'} />
                        </IconContext.Provider>
                        <p>編集</p>
                    </div>
                    <div className='delete' onClick={() => {
                        openDeleteModal(chatGroup.id, chatGroup.title)
                        handleClose()
                    }}>
                        <IconContext.Provider value={{ color: `${textColor.error}`, size: '20px' }}>
                            <RiDeleteBin5Line />
                        </IconContext.Provider>
                        <p>削除</p>
                    </div>
                </PastChatMenu>
            </Menu>
        </PastChatMenuWrapper>
    );
})

export default PastChatMenuButton