import { FormControl, FormHelperText, IconButton, InputLabel, OutlinedInput, Paper } from '@mui/material';
import { useState } from 'react'
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IValidation } from '../../Utils/registerUtils';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export type PasswordButtonProps = {
    handleChange: (prop: any) => (event: any) => {};
    value: string;
    isValid: IValidation;
    label: string;
    property: string;

}
function PasswordButton(props: PasswordButtonProps) {
    const {handleChange,value,isValid,label,property} = props;
    const [showPassword,setShowPassword] = useState(false)
    const handleClickShowPasssword = () => {
        setShowPassword(prev => !prev);
    }
    return (
        <Item>
            <FormControl sx={{ m: 1, width: '90%', margin: "auto" }} variant="outlined">
                <InputLabel htmlFor={property}>{label}</InputLabel>
                <OutlinedInput
                    id={property}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={handleChange(property)}
                    error={!isValid.valid}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPasssword}
                                onMouseDown={handleClickShowPasssword}
                                edge="end"
                            >
                                {showPassword && <VisibilityOff />}
                                {!showPassword && <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={property}
                />
                <FormHelperText id="outlined-weight-helper-text">{isValid.validation.join(" , ")}</FormHelperText>
            </FormControl>
        </Item>
    )
}

export default PasswordButton