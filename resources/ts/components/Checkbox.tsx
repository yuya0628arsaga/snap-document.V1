import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { lightBlue } from '@mui/material/colors';

const CheckboxLabels = (props) => {
    const { targetChat, chats, includeToHistory } = props

    const handleCheckbox = () => {
        includeToHistory(targetChat, chats)
    }
    return (
      <FormGroup>
            <FormControlLabel
                label="この会話を次の質問に含める"
                control={<Checkbox
                    onChange={handleCheckbox}
                    sx={{
                        '&.Mui-checked': {
                            color: lightBlue[600],
                        },
                    }} />}
             />
      </FormGroup>
    );
}

export default CheckboxLabels