import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { borderColor } from '../utils/themeClient'
import styled from '@emotion/styled';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { textColor } from '../utils/themeClient'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: `1px solid ${borderColor.gray}`,
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ButtonContainer = styled('div')`
    margin-top: 42px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`

const theme = createTheme({
    palette: {
        info: {
            main: `${borderColor.black}`
        },
        error: {
            main: `${textColor.error}`
        },
    },
});


type BasicModalPropsType = {
    open: boolean,
    setOpen: (open: boolean) => void,
    modalTitle: string,
    modalDescription: string,
    buttonType: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning",
    buttonText: string,
    handleExecute: () => void,
}

export default function BasicModal(props: BasicModalPropsType) {
    const { open, setOpen, modalTitle, modalDescription, buttonType, buttonText, handleExecute } = props
    const handleClose = () => setOpen(false);

    return (
        <div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    { modalTitle }
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    { modalDescription }
                </Typography>
                <ButtonContainer>
                    <ThemeProvider theme={theme}>
                        <Button variant="outlined" color="info" onClick={handleClose}>
                            閉じる
                        </Button>
                            <Button variant="contained" color={buttonType} onClick={() => {
                                handleExecute()
                                handleClose()
                            }}>
                            { buttonText }
                        </Button>
                    </ThemeProvider>
                </ButtonContainer>
            </Box>
        </Modal>
        </div>
    );
}