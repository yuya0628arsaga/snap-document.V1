import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import styled from '@emotion/styled';

const SelectBoxContainer = styled('div')`
    padding: 16px;
`

const SelectBox = (props) => {
    const { isSelectManual, setIsSelectManual, manual, setManual } = props

    const handleChange = (event: SelectChangeEvent) => {
        setManual(event.target.value);
        // 未選択のバリデーションに引っかかった後に選択した場合にバリデーションメッセージを消す
        if (!isSelectManual && event.target.value) {
            setIsSelectManual(true)
        }
    };

    return (
        <SelectBoxContainer>
            <Box sx={{ maxWidth: 200 }}>
                <FormControl fullWidth error={!isSelectManual}>
                    <InputLabel id="manual-select-label">マニュアルを選択</InputLabel>
                    <Select
                        labelId="manual-select-label"
                        id="manual-select"
                        value={manual}
                        label="マニュアルを選択"
                        onChange={handleChange}
                    >
                        <MenuItem value={'Man_Digest_v9'}>Man_Digest_v9</MenuItem>
                        <MenuItem value={'PCBmanual3DV5'}>PCBmanual3DV5</MenuItem>
                        <MenuItem value={'PCBmanualV5'}>PCBmanualV5</MenuItem>
                    </Select>
                    { !isSelectManual && <FormHelperText>マニュアルを選択して下さい</FormHelperText> }
                </FormControl>
            </Box>
        </SelectBoxContainer>
    );
}

export default SelectBox