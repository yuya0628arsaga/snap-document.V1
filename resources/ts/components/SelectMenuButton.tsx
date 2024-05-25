import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styled from '@emotion/styled';
import { textColor } from '../utils/themeClient';

const SelectMenuButtonWrapper = styled('div')`
`

type SelectMenuButtonPropsType = {
    menuItems: { label: string, value: string }[],
    value: string,
    setValue: (value: string) => void,
}

const SelectMenuButton = (props: SelectMenuButtonPropsType) => {
    const { menuItems, value, setValue } = props

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [label, setLabel] = React.useState('')
    React.useEffect(() => {
        setLabel(menuItems[0].label)
    }, [])

    return (
        <SelectMenuButtonWrapper>
            <Button
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                variant={'text'}
                sx={{
                    color: `${textColor.black}`,
                    textTransform: 'none',
                }}
            >
                {label}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {menuItems.map((item, i: number) => {
                    return (
                        <MenuItem
                            key={i}
                            onClick={(e) => {
                                setLabel(item.label);
                                setValue(item.value);
                                handleClose();
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </SelectMenuButtonWrapper>
    )
}

export default SelectMenuButton