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
import '../Mng.css'
import io from 'socket.io-client'
import { ENDPT, my_API } from '../../../helper/Helper'
import { UploadImageUser } from '../../../helper/UploadImage'

let socket;

const AddAccount = ({ handleClose }) => {
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

    const handleSave = async event => {
        event.preventDefault();
        setUsernameErr('')
        setPasswordErr('');
        setNameErr('');
        setEmailErr('');
        try {
            setIsSuccess(true);
            const res = await fetch(my_API + 'signup', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'username': values.username,
                    'password': values.password,
                    'img_url': '',
                    'name': values.name,
                    'email': values.email,
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            console.log('signup response', data)
            if (data.errors) {
                setUsernameErr(data.errors.username)
                setPasswordErr(data.errors.password);
                setNameErr(data.errors.name);
                setEmailErr(data.errors.email);
                setIsSuccess(false);
            } else {
                let img_upload_data = await UploadImageUser(avatarImage)
                    .catch(err => console.log(err));

                socket.emit('account-created', 
                    data.user._id, 
                    img_upload_data.secure_url,
                    img_upload_data.public_id, 
                    handleClose);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPT])

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
                            sx={{ height: avatarHeight}}
                            onClick={() => { inputAvatarImage.current.click() }}
                            src={avatarImage ? URL.createObjectURL(avatarImage)
                                : ''}>
                            Ảnh đại diện
                        </Avatar>
                    </div>
                </div>
                <form className='modal-form'>
                    <TextField
                        size="small"
                        label="Họ và tên"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={handleChange('name')}
                        helperText={nameErr}
                        error={nameErr}
                    />
                    <TextField
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