import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Button, Avatar, Box, MenuItem, FormControl,
  Select, TextField, CircularProgress, Alert,
  OutlinedInput, InputAdornment, IconButton,
  FormHelperText, Snackbar
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
      prefix="0"
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
  const [phoneErr, setPhoneErr] = useState('');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }

  const handleImageChange = (event) => {
    if (isFileImage(event.target.files[0])) {
      setAvatarImage(event.target.files[0]);
    } else {
      alert('???nh ?????i di???n n??n l?? t???p c?? ??u??i .jpg, .png, .bmp,...')
    }
  };

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const toggleEditMode = (e) => {
    e.preventDefault();
    setIsEdit(!isEdit);
    //reset state
    setName('')
    setGender(user.gender)
    setPhone('')
    setEmail('')
    setDescription('')
    setFacebook('')
    setAvatarImage(null)
  }

  const validatePassword = () => {
    let isOk = true;
    if (!password) {
      setPasswordErr("M???t kh???u tr???ng");
      isOk = false;
    }
    if (!newPassword) {
      setNewPasswordErr("M???t kh???u m???i tr???ng")
      isOk = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordErr("M???t kh???u nh???p l???i tr???ng")
      isOk = false;
    }
    if (newPassword !== confirmPassword) {
      setNewPasswordErr("M???t kh???u m???i kh??ng kh???p")
      setConfirmPasswordErr("M???t kh???u nh???p l???i kh??ng kh???p")
      isOk = false;
    }
    return isOk;
  }

  const handleSaveInfo = (e) => {
    e.preventDefault();
    //console.log(name, gender, phone, email, description, facebook)
    var formData = new FormData();
    formData.append("file", avatarImage);
    formData.append("name", name ? name : user.name)
    formData.append("gender", gender)
    formData.append("phone", phone ? phone : user.phone)
    formData.append("email", email ? email : user.email)
    formData.append("description", description ? description : user.description)
    formData.append("facebook", facebook ? facebook : user.facebook)

    axiosInstance.put(`/update`,
      formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      //response.data
      //console.log(response.data)
      showSnackbar("Th??ng tin c???p nh???t th??nh c??ng!")
      setUser(response.data)
    }).catch(err => {
      //err.response.data
      console.log(err.response.data)
      if (err.response.data.errors) {
        setPhoneErr(err.response.data.errors.phone)
        setEmailErr(err.response.data.errors.email)
      }
    })
  }

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      axiosInstance.patch('/changepassword',
        JSON.stringify({
          "password": password,
          "newPassword": newPassword
        }), {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }).then(response => {
        //response.data
        showSnackbar("?????i m???t kh???u th??nh c??ng!")
      }).catch(err => {
        const data = err.response.data;
        if (data.errors) {
          setPasswordErr(err.response.data.errors.password)
        }
        if (data.error) {
          if (data.error.includes('6 k?? t???'))
            setNewPasswordErr("M???t kh???u ??t h??n 6 k?? t???")
        }
      })
    }
  }

  useEffect(() => {
    if (user) {
      setGender(user.gender)
    }
  }, [user])

  return (
    <div className='page-infor' style={{ display: "flex" }}>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">{alertMessage}</Alert>
      </Snackbar>
      {!user ?
        <Box className='loading-temp'>
          <CircularProgress />
        </Box>
        : <div className='div-infor'>
          <h3 className='title-profile'>Th??ng tin c?? nh??n</h3>

          <div className='container-info'>
            <div className='header-title-info'>
              <h4 className='title-profile-1'>Th??ng tin chung</h4>
              <h5 onClick={toggleEditMode}>Ch???nh s???a</h5>
            </div>

            <div style={{ display: "flex", paddingTop: 10 }}>
              <div className='div-action-image'>
                <div className='image'>
                  <input type="file" style={{ display: 'none' }} ref={inputAvatarImage} onChange={handleImageChange} />
                  <Avatar
                    sx={{ width: 120, height: 120, cursor: isEdit ? 'pointer' : 'auto' }}
                    src={avatarImage ? URL.createObjectURL(avatarImage)
                      : user.img_url}
                    onClick={isEdit ? () => { inputAvatarImage.current.click() } : null}
                  />
                </div>
                <Button disabled={!isEdit}
                  variant='text'
                  sx={{ textTransform: "none", }}
                  onClick={() => { inputAvatarImage.current.click() }}>
                  ?????i ???nh
                </Button>
              </div>
              <div style={{ flex: 1, paddingLeft: 40 }}>
                <div className='div-text-profile'>
                  <label>H??? v?? t??n:</label>
                  {isEdit ? <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ minWidth: 280 }}
                    placeholder={user.name}
                    size="small"
                  /> : <p id='textresult'>{user.name}</p>}
                </div>
                <div className='div-text-profile'>
                  <label>Gi???i t??nh:</label>
                  {isEdit ? <Box
                    sx={{ minWidth: 120 }} >
                    <FormControl fullWidth size='small'>
                      <Select
                        value={gender}
                        onChange={handleChange}
                      >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="N???">N???</MenuItem>
                        <MenuItem value="Kh??c">Kh??c</MenuItem>
                      </Select>
                    </FormControl>
                  </Box> : <p id='textresult2'>{user.gender}</p>}
                </div>
                <div className='div-text-profile'>
                  <label>S??? ??i???n tho???i:</label>
                  {isEdit ? <TextField
                    error={phoneErr}
                    helperText={phoneErr}
                    value={phone}
                    onChange={(e) => {
                      setPhoneErr('')
                      setPhone(e.target.value)
                    }}
                    sx={{ minWidth: 280 }}
                    placeholder={user.phone}
                    size="small"
                    InputProps={{
                      inputComponent: NumberFormatCustom
                    }}
                  /> : <p id='textresult3'>{user.phone}</p>}

                </div>
                <div className='div-text-profile'>
                  <label>?????a ch??? email:</label>
                  {isEdit ? <TextField
                    error={emailErr}
                    helperText={emailErr}
                    value={email}
                    onChange={(e) => {
                      setEmailErr('')
                      setEmail(e.target.value)
                    }}
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
              <h4 className='title-profile-1'>M?? t??? b???n th??n</h4>
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
              <h4 className='title-profile-1'>Li??n l???c kh??c</h4>
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
                : <a href={user.facebook}
                  target="_blank"
                  id='textresult6'>
                  {user.facebook}
                </a>}

            </div>
            {isEdit ? <div className='stack-right'>
              <Button variant='contained'
                onClick={handleSaveInfo}>
                L??u
              </Button>
              <Button variant='outlined'
                onClick={toggleEditMode}>
                H???y
              </Button>
            </div> : <></>}
          </div>

        </div>}

      <div style={{ flex: 1 }}>
        <div className='div-image'>
          <img className='imageInfo' src={ImageInfo} alt="???nh logo" />
          <h1 className='name-logo'>School Club Management</h1>
        </div>
        <div style={{ border: "1px solid #ccc", borderRadius: 5, margin: 20, marginLeft: 0, marginTop: 20, height: "auto", backgroundColor: 'white' }}>
          <div style={{ display: "flex", borderBottom: "1px solid #ccc", alignItems: "center" }}>
            <div style={{ padding: 10, paddingLeft: 25 }}>
              <KeyIcon sx={{ fontSize: "2.5rem", transform: "rotate(-45deg)" }}></KeyIcon>
            </div>
            <div style={{ lineHeight: 1.4 }}>
              <h4 className='title-reset-pass'>?????i m???t kh???u</h4>
              <p style={{ width: 500, color: "grey", fontFamily: "arial", fontSize: "14px" }}>B???n n??n s??? d???ng m???t kh???u m???nh m?? m??nh ch??a s??? d???ng ??? ????u kh??c</p>
            </div>
          </div>
          <div style={{ borderBottom: "1px solid #ccc" }}>
            <div className='div-text-password'>
              <label>M???t kh???u hi???n t???i:</label>
              <FormControl variant="outlined" error={passwordErr}>
                <OutlinedInput size='small'
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPasswordErr('')
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
              <label>M???t kh???u m???i:</label>
              <FormControl variant="outlined" error={newPasswordErr}>
                <OutlinedInput size='small'
                  id="outlined-adornment-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPasswordErr('')
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
              <label>Nh???p l???i m???t kh???u m???i:</label>
              <FormControl variant="outlined" error={confirmPasswordErr}>
                <OutlinedInput size='small'
                  id="outlined-adornment-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPasswordErr('')
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
              <label style={{ color: "#1976d2", marginLeft: 100, cursor: 'pointer' }}>B???n qu??n m???t kh???u?</label>
            </div>
          </div>
          <div className='list-action-password'>
            <Button variant='outlined' onClick={handleChangePassword}>L??u thay ?????i</Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Info