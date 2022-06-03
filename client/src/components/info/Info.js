import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Button, Avatar, Box, MenuItem, FormControl,
  Select, TextField, CircularProgress, InputLabel,
  OutlinedInput, InputAdornment, IconButton, FormHelperText
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import NumberFormat from "react-number-format";
import './Info.css'
import KeyIcon from '@mui/icons-material/Key';
import ImageInfo from '../../assets/logoweb.png'
import { UserContext } from '../../UserContext';
import axiosInstance from '../../helper/Axios';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
    />
  );
}


const Info = () => {
  const inputAvatarImage = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [avatarImage, setAvatarImage] = useState();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [facebook, setFacebook] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordErr, setNewPasswordErr] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordErr, setConfirmPasswordErr] = useState('');

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

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    console.log(name, gender, phone, email, description, facebook)
    // var formData = new FormData();
    // formData.append("file", avatarImage);
    // formData.append("name", name)
    // formData.append("gender", gender)
    // formData.append("phone", phone)
    // formData.append("email", email)
    // formData.append("description", description)
    // formData.append("facebook", facebook)

    // axiosInstance.put(`/update/${user._id}`,
    //   formData, {
    //   withCredentials: true,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
  }

  useEffect(() => {
    if (user) {
      setGender(user.gender)
    }
  }, [user])

  return (
    <div className='page-infor' style={{ display: "flex" }}>
      {!user ?
        <Box className='loading-temp'>
          <CircularProgress />
        </Box>
        : <div className='div-infor'>
          <h3 className='title-profile'>Thông tin cá nhân</h3>

          <div className='container-info'>
            <div className='header-title-info'>
              <h4 className='title-profile-1'>Thông tin chung</h4>
              <h5 onClick={() => setIsEdit(!isEdit)}>Chỉnh sửa</h5>
            </div>

            <div style={{ display: "flex", paddingTop: 10 }}>
              <div className='div-action-image'>
                <div className='image'>
                  <input type="file" style={{ display: 'none' }} ref={inputAvatarImage} onChange={handleImageChange} />
                  <Avatar
                    sx={{ width: 120, height: 120, cursor: 'pointer' }}
                    src={avatarImage ? URL.createObjectURL(avatarImage)
                      : user.img_url}
                    onClick={() => { inputAvatarImage.current.click() }}
                  />
                </div>
                <Button
                  variant='text'
                  sx={{ textTransform: "none", }}
                  onClick={() => { inputAvatarImage.current.click() }}>
                  Đổi ảnh
                </Button>
              </div>
              <div style={{ flex: 1, paddingLeft: 40 }}>
                <div className='div-text-profile'>
                  <label>Họ và tên:</label>
                  {isEdit ? <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ minWidth: 280 }}
                    placeholder={user.name}
                    size="small"
                  /> : <p id='textresult'>{user.name}</p>}
                </div>
                <div className='div-text-profile'>
                  <label>Giới tính:</label>
                  {isEdit ? <Box
                    sx={{ minWidth: 120 }} >
                    <FormControl fullWidth size='small'>
                      <Select
                        value={gender}
                        onChange={handleChange}
                      >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                      </Select>
                    </FormControl>
                  </Box> : <p id='textresult2'>{user.gender}</p>}


                </div>
                <div className='div-text-profile'>
                  <label>Số điện thoại:</label>
                  {isEdit ? <TextField
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ minWidth: 280 }}
                    placeholder={user.phone}
                    size="small"
                    InputProps={{
                      inputComponent: NumberFormatCustom
                    }}
                  /> : <p id='textresult3'>{user.phone}</p>}

                </div>
                <div className='div-text-profile'>
                  <label>Địa chỉ email:</label>
                  {isEdit ? <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ minWidth: 280 }}
                    placeholder={user.email}
                    size="small"
                  /> : <p id='textresult4'>{user.email}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className='container-info'>
            <div className='header-title-info'>
              <h4 className='title-profile-1'>Mô tả bản thân</h4>
            </div>
            <div className='div-text-profile'>
              {isEdit ? <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ minWidth: 420, marginRight: 3 }}
                placeholder={user.description}
                size="small"
                multiline
                fullWidth
                rows={3}
              />
                : <p id='textresult5'
                  className='text-description-profile'>
                  {user.description}
                </p>}
            </div>

          </div>
          <div className='container-info-last'>
            <div className='header-title-info'>
              <h4 className='title-profile-1'>Liên lạc khác</h4>
            </div>
            <div className='div-text-profile'>
              <label>Facebook:</label>
              {isEdit ? <TextField
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                sx={{ minWidth: 300, marginRight: 3 }}
                placeholder={user.facebook}
                size="small"
                fullWidth
              />
                : <p id='textresult6'>{user.facebook}</p>}

            </div>
            {isEdit ? <div className='stack-right'>
              <Button variant='contained'
                onClick={handleSaveInfo}>
                Lưu
              </Button>
              <Button variant='outlined'
                onClick={() => setIsEdit(false)}>
                Hủy
              </Button>
            </div> : <></>}
          </div>

        </div>}

      <div style={{ flex: 1 }}>
        <div className='div-image'>
          <img className='imageInfo' src={ImageInfo} alt="ảnh logo" />
          <h1 className='name-logo'>School Club Management</h1>
        </div>
        <div style={{ border: "1px solid #ccc", borderRadius: 5, margin: 20, marginLeft: 0, marginTop: 20, height: "50vh", backgroundColor: 'white' }}>
          <div style={{ display: "flex", borderBottom: "1px solid #ccc", alignItems: "center" }}>
            <div style={{ padding: 10, paddingLeft: 25 }}>
              <KeyIcon sx={{ fontSize: "2.5rem", transform: "rotate(-45deg)" }}></KeyIcon>
            </div>
            <div style={{ lineHeight: 1.4 }}>
              <h4 className='title-reset-pass'>Đổi mật khẩu</h4>
              <p style={{ width: 500, color: "grey", fontFamily: "arial", fontSize: "14px" }}>Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu khác</p>
            </div>
          </div>
          <div style={{ borderBottom: "1px solid #ccc" }}>
            <div className='div-text-password'>
              <label>Mật khẩu hiện tại:</label>
              <FormControl variant="outlined" error={passwordErr}>
                <OutlinedInput size='small'
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="outlined-adornment-password">{passwordErr}</FormHelperText>
              </FormControl>
            </div>
            <div className='div-text-password'>
              <label>Mật khẩu mới:</label>
              <FormControl variant="outlined" error={newPasswordErr}>
                <OutlinedInput size='small'
                  id="outlined-adornment-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="outlined-adornment-password">{newPasswordErr}</FormHelperText>
              </FormControl>
            </div>
            <div className='div-text-password'>
              <label>Nhập lại mật khẩu mới:</label>
              <FormControl variant="outlined" error={confirmPasswordErr}>
                <OutlinedInput size='small'
                  id="outlined-adornment-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="outlined-adornment-password">{confirmPasswordErr}</FormHelperText>
              </FormControl>
            </div>
            <div style={{ padding: 20 }} >
              <label style={{ color: "#1976d2", marginLeft: 100, cursor: 'pointer' }}>Bạn quên mật khẩu ?</label>
            </div>
          </div>
          <div className='list-action-password'>
            <Button variant='outlined'>Lưu thay đổi</Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Info