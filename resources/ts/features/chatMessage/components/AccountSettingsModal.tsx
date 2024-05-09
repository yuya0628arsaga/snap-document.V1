import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { borderColor } from '../../../utils/themeClient';
import { fontSize } from '../../../utils/themeClient';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import styled from '@emotion/styled';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: `1px solid ${borderColor.gray}`,
  boxShadow: 24,
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
    >.toggle-container {
        padding: 24px;
    }
`

type AccountSettingsModalProps = {
    open: boolean,
    setOpen: (open: boolean) => {},
}

const AccountSettingsModal = (props: AccountSettingsModalProps) => {
    const { open, setOpen } = props
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
                    <div className='toggle-container'>
                        <FormGroup>
                            <FormControlLabel control={<Switch defaultChecked />} label="参照したドキュメントのページを表示する" />
                        </FormGroup>
                    </div>
                </Wrapper>
            </Box>
        </Modal>
        </div>
    );
}

export default AccountSettingsModal