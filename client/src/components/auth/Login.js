import React, { useContext, useState } from 'react'
import { UserContext } from '../../UserContext'
import { Redirect } from 'react-router-dom'
import {
    InputAdornment, IconButton, OutlinedInput, InputLabel,
    FormControl, TextField, Button, FormHelperText
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosInstance from '../../helper/Axios';
import ImageInfo1 from '../../assets/logoweb.png'
import './Login.css'

const Login = () => {
    const { user, setUser } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [generalErr, setGeneralErr] = useState('');
    const [usernameErr, setUsernameErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log(username, password)
        setGeneralErr('')
        setUsernameErr('')
        setPasswordErr('')
        try {
            axiosInstance.post('/login', JSON.stringify({ username: username.trim(), password }),
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                setUser(response.data.user);
            }).catch(err => {
                //console.log(err.response.data)
                const errData = err.response.data?.errors;
                if (errData) {
                    setUsernameErr(errData.username);
                    setPasswordErr(errData.password);
                } else {
                    setGeneralErr("Something went wrong")
                }
            })
        } catch (error) {
            console.log(error)
            setGeneralErr(error.message)
        }
    }

    if (user) {
        return <Redirect to='/scheduler' />
    }
    return (
        <div className='div-container-main'>
            <div className='container-login'>
                <div style={{backgroundColor:"white", borderRadius: 15 }}>
                    <h2 className='name-club-login'><font className="style" color="E25648">Club</font>Management</h2>
                    <div className='login'>
                        <h1>Đăng nhập</h1>
                        <span>{generalErr}</span>
                        <div className='login-form' onSubmit={handleSubmit}>
                            <TextField
                                label="Tài khoản"
                                variant='outlined'
                                sx={{ width: '70%' }}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                helperText={usernameErr}
                                error={usernameErr}
                            />
                            <FormControl sx={{ width: '70%' }} variant="outlined" error={passwordErr}>
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
                            <div className='button-login' onClick={handleSubmit}>
                                Đăng nhập
                            </div>
                        </div>
                    </div>
                </div>
                <div className='div-login-right'>
                    <img className='imageInfo1' src={ImageInfo1} alt="club management"/>
                    <h1>Hello, Friend!</h1>
                    <p>Hãy tôi luyện thành một chiến binh, đừng khép mình lại.</p>
                </div>
            </div>
        </div>
    )
}

export default Login