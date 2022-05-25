import React, { useState, useEffect, useRef } from 'react'
import {
    OutlinedInput, InputLabel, FormControl, InputAdornment,
    IconButton, Button, TextField, Avatar, FormHelperText
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../Mng.css'
import axiosInstance from '../../../helper/Axios';

const AddAccount = ({ handleClose, users, setUsers }) => {
    const [avatarHeight, setAvatarHeight] = useState(150);
    const avatarRef = useRef();
    const inputAvatarImage = useRef(null);
    const [avatarImage, setAvatarImage] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
    });
    const [isSuccess, setIsSuccess] = useState(false)
    const [nameErr, setNameErr] = useState('');
    const [usernameErr, setUsernameErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [emailErr, setEmailErr] = useState('');

    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

    const handleImageChange = (event) => {
        if (isFileImage(event.target.files[0])) {
            setAvatarImage(event.target.files[0]);
        } else {
            alert('Ảnh đại diện nên là tệp có đuôi .jpg, .png, .bmp,...')
        }
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const resetState = () => {
        setAvatarImage(null)
        setValues({
            name: '',
            username: '',
            password: '',
            email: '',
        })
    }

    const handleSave = async event => {
        event.preventDefault();
        setUsernameErr('')
        setPasswordErr('');
        setNameErr('');
        setEmailErr('');

        var formData = new FormData();
        formData.append("file", avatarImage);
        formData.append("username", values.username)
        formData.append("password", values.password)
        formData.append("name", values.name)
        formData.append("email", values.email)

        try {
            setIsSuccess(true);
            axiosInstance.post('/signup',
                formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                //response.data
                setUsers([...users, response.data])
                resetState();
            }).catch(err => {
                //console.log(err.response.data)
                setUsernameErr(err.response.data.errors.username);
                setPasswordErr(err.response.data.errors.password);
                setNameErr(err.response.data.errors.name);
                setEmailErr(err.response.data.errors.email);
            })
            setIsSuccess(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setAvatarHeight(avatarRef ? avatarRef?.current?.offsetWidth : 150)
    }, [avatarRef])

    return (
        <div>
            <h2 id="modal-modal-title">
                Thêm tài khoản mới
            </h2>
            <div id="modal-modal-description">
                <div className='div-left'>
                    <div className='modal-avatar'>
                        <input type="file" ref={inputAvatarImage} onChange={handleImageChange} />
                        <Avatar className='avatar' ref={avatarRef}
                            sx={{ height: avatarHeight }}
                            onClick={() => { inputAvatarImage.current.click() }}
                            src={avatarImage ? URL.createObjectURL(avatarImage)
                                : ''}>
                            Ảnh đại diện
                        </Avatar>
                    </div>
                </div>
                <form className='modal-form'>
                    <TextField
                        value={values.name}
                        size="small"
                        label="Họ và tên"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('name')}
                        helperText={nameErr}
                        error={nameErr}
                    />
                    <TextField
                        value={values.username}
                        size="small"
                        label="Tài khoản"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('username')}
                        helperText={usernameErr}
                        error={usernameErr}
                    />
                    <FormControl sx={{ width: '100%' }} variant="outlined" error={passwordErr}>
                        <InputLabel htmlFor="outlined-adornment-password" size="small">Mật khẩu</InputLabel>
                        <OutlinedInput
                            size="small"
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
                        <FormHelperText id="outlined-adornment-password">{passwordErr}</FormHelperText>
                    </FormControl>
                    <TextField
                        value={values.email}
                        size="small"
                        label="Email"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('email')}
                        helperText={emailErr}
                        error={emailErr}
                    />
                    <div className='stack-right'>
                        <Button disabled={isSuccess}
                            variant="contained"
                            disableElevation
                            onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button disabled={isSuccess}
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