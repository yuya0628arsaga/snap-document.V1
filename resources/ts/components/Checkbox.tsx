import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { lightBlue } from '@mui/material/colors';
import styled from '@emotion/styled';

type CheckboxLabelsPropsType = {
    label: string,
    handleChangeCheckbox: () => void,
}

const CheckboxLabelsWrapper = styled('div')`
    >.MuiFormGroup-root >.MuiFormControlLabel-root >.MuiTypography-root {
        margin-top: 3px;
    }
`

const CheckboxLabels = (props: CheckboxLabelsPropsType) => {
    const { label, handleChangeCheckbox } = props

    return (
        <CheckboxLabelsWrapper>
            <FormGroup>
                <FormControlLabel
                    label={label}
                    control={<Checkbox
                        onChange={() => handleChangeCheckbox()}
                        sx={{
                            '&.Mui-checked': {
                                color: lightBlue[600],
                            },
                        }} />}
                />
            </FormGroup>
        </CheckboxLabelsWrapper>
    );
}

export default CheckboxLabels