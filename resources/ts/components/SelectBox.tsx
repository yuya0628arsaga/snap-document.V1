import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from '@emotion/styled';

const SelectBoxContainer = styled('div')`
    padding: 16px;
`

const SelectBox = () => {
    const [manual, setManual] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setManual(event.target.value);
    };

    return (
        <SelectBoxContainer>
            <Box sx={{ maxWidth: 200 }}>
                <FormControl fullWidth>
                    <InputLabel id="manual-select-label">マニュアルを選択</InputLabel>
                    <Select
                        labelId="manual-select-label"
                        id="manual-select"
                        value={manual}
                        label="マニュアルを選択"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Man_Digest_v9</MenuItem>
                        <MenuItem value={20}>PCBmanual3DV5</MenuItem>
                        <MenuItem value={30}>PCBmanualV5</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </SelectBoxContainer>
    );
}

export default SelectBox