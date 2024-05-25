import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { borderColor, textColor } from '../../../utils/themeClient';
import { fontSize } from '../../../utils/themeClient';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import styled from '@emotion/styled';
import SelectMenuButton from '../../../components/SelectMenuButton';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: `1px solid ${borderColor.gray}`,
    boxShadow: 24,
    borderRadius: 2,
};

const Wrapper = styled('div')`
    height: 100%;
    >.title {
        border-bottom: 1px solid ${borderColor.gray};
        height: 56px;
        display: flex;
        align-items: center;
        padding-left: 24px;
        font-size: ${fontSize.xl};
    }
    >.contents {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        >.toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: solid 1px ${borderColor.gray};
        }
    }
`

export type setIsGetPdfPageParam = boolean | ((isGetPdfPage: boolean) => boolean)

type AccountSettingsModalProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    isGetPdfPage: boolean,
    setIsGetPdfPage: (isGetPdfPage: setIsGetPdfPageParam) => void,
    gptModel: string,
    setGptModel: (gptModel: string) => void,
}

const AccountSettingsModal = (props: AccountSettingsModalProps) => {
    const { open, setOpen, isGetPdfPage, setIsGetPdfPage, gptModel, setGptModel } = props

    const GPT_MODELS = [
        { label: 'GPT-4o （賢くて、速い）', value: 'gpt-4o' },
        { label: 'GPT-3.5 Turbo （速い）', value: 'gpt-3.5-turbo' },
    ]
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
                <Wrapper>
                    <div className='title'>
                        設定
                    </div>
                    <div className='contents'>
                        <div className='toggle-container'>
                            <div className='label'>
                                参照したドキュメントのページを表示する
                            </div>
                            <FormControlLabel
                                control={<Switch checked={isGetPdfPage} />} label=""
                                onChange={() => {
                                    setIsGetPdfPage(prev => !prev)
                                }}
                            />
                        </div>
                        <div className='toggle-container'>
                            <div className='label'>
                                GPTモデル
                            </div>
                            <SelectMenuButton
                                menuItems={GPT_MODELS}
                                value={gptModel}
                                setValue={setGptModel}
                            />
                        </div>
                    </div>
                </Wrapper>
            </Box>
        </Modal>
        </div>
    );
}

export default AccountSettingsModal