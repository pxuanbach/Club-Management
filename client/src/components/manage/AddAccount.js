import React, { useState, useEffect } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import io from 'socket.io-client';
import './Mng.css'

let socket;

const AddAccount = ({ handleClose }) => {
    const ENDPT = 'localhost:5000'
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleSave = event => {
        event.preventDefault();
        if (values.username && values.password) {
            socket.emit('saveAccount', values.username, values.password, () => { })
        }
        console.log('Username', values.username);
        console.log('Password', values.password);
    }

    useEffect(() => {
        socket = io(ENDPT);
        //socket.emit('join', { username: values.username, password: values.password})
    }, [])

    return (
        <div>
            <h2 id="modal-modal-title">
                Thêm tài khoản mới
            </h2>
            <div id="modal-modal-description">
                <div className='modal-avatar'>
                    <img id='avatar' alt="Avatar" src="https://i.pinimg.com/236x/69/69/2a/69692a5bcbe75766e5bc1c6bd9a3024c.jpg" />
                </div>
                <form className='modal-form'>
                    <TextField
                        label="Username"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('username')}
                    />
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange("password")}
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
                    </FormControl>
                    <div className='stack-right' item xs={6}>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            disableElevation
                            onClick={handleClose}>
                            Hủy
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddAccount