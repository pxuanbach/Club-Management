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
import io from 'socket.io-client';
import './Mng.css'

let socket;

const AddAccount = ({ handleClose }) => {
    const ENDPT = 'localhost:5000'
	const inputAvatarImage = useRef(null);
    const [avatarImage, setAvatarImage] = useState();
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

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
        if (values.username && values.password) {
            //socket.emit('saveAccount', values.username, values.password, handleClose)
        }
        console.log('Username', values.username);
        console.log('Password', values.password);
        console.log('Avatar', avatarImage)
    }

    useEffect(() => {
        //socket = io(ENDPT);
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
                        sx={{ width: 190, height: 190 }}
                        onClick={() => {inputAvatarImage.current.click()}}
                        src={avatarImage ? URL.createObjectURL(avatarImage) 
                        : ''}>
                        Chọn ảnh đại diện
                    </Avatar>
                </div>
                <form className='modal-form'>
                    <TextField
                        label="Tài khoản"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('username')}
                    />
                    <FormControl sx={{ width: '100%' }} variant="outlined">
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
                    </FormControl>
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