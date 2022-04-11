import React, { useContext, useState } from 'react'
import { UserContext } from '../../UserContext'
import { Redirect } from 'react-router-dom'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import './Login.css'
import { my_API } from '../../helper/Helper';

const Login = () => {
    const { user, setUser } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameErr, setUsernameErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username, password)
        setUsernameErr('')
        setPasswordErr('')
        try {
            const res = await fetch(my_API + 'login', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            console.log(data)
            if (data.errors) {
                setUsernameErr(data.errors.username);
                setPasswordErr(data.errors.password);
            }
            if (data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (user) {
        return <Redirect to='/' />
    }
    return (
        <div className='login'>
            <h1>Đăng nhập</h1>
            <div className='login-form' onSubmit={handleSubmit}>
                <TextField
                    label="Tài khoản"
                    variant='outlined'
                    sx={{ width: '100%' }}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    helperText={usernameErr}
                    error={usernameErr}
                />
                <FormControl sx={{ width: '100%' }} variant="outlined" error={passwordErr}>
                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        fullWidth={true}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                    <FormHelperText id="outlined-adornment-password">{passwordErr}</FormHelperText>
                </FormControl>
                <Button variant='contained' 
                    disableElevation
                    onClick={handleSubmit}>
                    Đăng nhập
                </Button>
            </div>
        </div>
    )
}

export default Login