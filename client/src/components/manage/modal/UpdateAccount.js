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

const UpdateAccount = ({handleClose, account, setAccount}) => {
  const inputAvatarImage = useRef(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [values, setValues] = useState({
    name: account.name,
    username: account.username,
    email: account.email,
  });
  const [nameErr, setNameErr] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarImage(event.target.files[0]);
    }
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSave = async event => {
    event.preventDefault();
    setUsernameErr('')
    setNameErr('');
    setEmailErr('');
  }

  useEffect(() => {
    console.log(account)
  }, [])

  return (
    <div>
      <h2 id="modal-modal-title">
        Cập nhật thông tin
      </h2>
      <div id="modal-modal-description">
        <div className='modal-avatar'>
          <input type="file" ref={inputAvatarImage} onChange={handleImageChange} />
          <Avatar className='avatar'
            sx={{ width: 200, height: 200 }}
            onClick={() => { inputAvatarImage.current.click() }}
            src={avatarImage ? URL.createObjectURL(avatarImage)
              : account.img_url}>
          </Avatar>
        </div>
        <form className='modal-form'>
          <TextField
            value={values.name}
            label="Họ và tên"
            variant='outlined'
            sx={{ width: '100%' }}
            onChange={handleChange('name')}
            helperText={nameErr}
            error={nameErr}
          />
          <TextField
            value={values.username}
            label="Tài khoản"
            variant='outlined'
            sx={{ width: '100%' }}
            onChange={handleChange('username')}
            helperText={usernameErr}
            error={usernameErr}
          />
          <TextField
          value={values.email}
            label="Email"
            variant='outlined'
            sx={{ width: '100%' }}
            onChange={handleChange('email')}
            helperText={emailErr}
            error={emailErr}
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

export default UpdateAccount