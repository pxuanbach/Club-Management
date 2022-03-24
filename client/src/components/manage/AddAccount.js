import React, { useState, useEffect, useRef } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import FormHelperText from '@mui/material/FormHelperText';
import io from 'socket.io-client';
import './Mng.css'
import {ENDPT} from '../../Helper'
import Validator from './Validator'

let socket;

const AddAccount = ({ handleClose }) => {
	const inputAvatarImage = useRef(null);
    const [avatarImage, setAvatarImage] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
    });

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarImage(event.target.files[0]);
        }
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleSave = event => {
        event.preventDefault();

        Validator(values, errors, setErrors)
        //if (values.username && values.password) {
            //socket.emit('create-account', values.username, values.password, handleClose)
        //}
        console.log('Username', values.username);
        console.log('Password', values.password);
        console.log('Name', values.name);
        console.log('Email', values.email);
        console.log('Avatar', avatarImage)
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
                    <input type="file" ref={inputAvatarImage} onChange={handleImageChange}/>
                    <Avatar className='avatar'
                        sx={{ width: 200, height: 200 }}
                        onClick={() => {inputAvatarImage.current.click()}}
                        src={avatarImage ? URL.createObjectURL(avatarImage) 
                        : ''}>
                            Ảnh đại diện
                    </Avatar>
                </div>
                <form className='modal-form'>
                    <TextField
                        label="Họ và tên"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('name')}
                        helperText={errors.name}
                        error={errors.name === '' ? false : true}
                    />
                    <TextField
                        label="Tài khoản"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('username')}
                        helperText={errors.username}
                        error={errors.username === '' ? false : true}
                    />
                    <FormControl sx={{ width: '100%' }} variant="outlined" error={errors.password}>
                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
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
                        <FormHelperText id="outlined-adornment-password">{errors.password}</FormHelperText>
                    </FormControl>
                    <TextField
                        label="Email"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('email')}
                        helperText={errors.email}
                        error={errors.email === '' ? false : true}
                    />
                    <div className='stack-right'>
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