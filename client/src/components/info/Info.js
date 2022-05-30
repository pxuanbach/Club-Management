import React, {useContext} from 'react'
import Button from '@mui/material/Button';
import './Info.css'
import KeyIcon from '@mui/icons-material/Key';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import ImageInfo from '../../assets/imageInfo.png'
import ImageInfo from '../../assets/logoweb.png'
import {UserContext} from '../../UserContext'
const Info = () => {
  const { user, setUser } = useContext(UserContext);
  const [gender, setGender] = React.useState('');

  const handleChange = (event) => {
    setGender(event.target.value);
  };
  const showhideFunction = () => {
    var actionList = document.getElementById("listButton");    
    if (actionList.className === "list-action-profile")    
    {    
      actionList.className = "display-list-button";  
      document.getElementById("textinput").style.display = "block";
      document.getElementById("textinput2").style.display = "block";
      document.getElementById("textinput3").style.display = "block";
      document.getElementById("textinput4").style.display = "block";
      document.getElementById("textresult").style.display = "none";
      document.getElementById("textresult2").style.display = "none";
      document.getElementById("textresult3").style.display = "none";
      document.getElementById("textresult4").style.display = "none";
    } else    
    {      
      actionList.className = "list-action-profile";  
      document.getElementById("textinput").style.display = "none";
      document.getElementById("textinput2").style.display = "none";
      document.getElementById("textinput3").style.display = "none";
      document.getElementById("textinput4").style.display = "none";
      document.getElementById("textresult").style.display = "block";
      document.getElementById("textresult2").style.display = "block";
      document.getElementById("textresult3").style.display = "block";
      document.getElementById("textresult4").style.display = "block";
    } 
}
const showhideFunction1 = () => {
  var actionList = document.getElementById("listButton1");    
  if (actionList.className === "list-action-profile")    
  {    
    actionList.className = "display-list-button";  
    document.getElementById("textinput5").style.display = "block";
    document.getElementById("textresult5").style.display = "none";
  } else    
  {      
    actionList.className = "list-action-profile";  
    document.getElementById("textinput5").style.display = "none";
    document.getElementById("textresult5").style.display = "block";
  } 
}
const showhideFunction2 = () => {
  var actionList = document.getElementById("listButton2");    
  if (actionList.className === "list-action-profile")    
  {    
    actionList.className = "display-list-button";  
    document.getElementById("textinput6").style.display = "block";
    document.getElementById("textresult6").style.display = "none";
  } else    
  {      
    actionList.className = "list-action-profile";  
    document.getElementById("textinput6").style.display = "none";
    document.getElementById("textresult6").style.display = "block";
  } 
}
  return (
    <div className='page-infor' style={{display: "flex"}}>
      <div className='div-infor'>
        <h3 className='title-profile'>Thông tin cá nhân</h3> 

        <div className='container-info'>
          <div className='header-title-info'>
            <h4 className='title-profile-1'>Thông tin chung</h4>
            <h5 onClick={() => showhideFunction() }>Edit</h5>
          </div>
          
          <div style={{display:"flex", paddingTop:10}}>
            <div className='div-action-image'>
              <div className='image'>
                <Avatar sx={{width: 120, height: 120}} src={user.img_url}/>
              </div>
              <Button variant='text' sx={{textTransform: "none",}}>Xóa ảnh</Button>
            </div>
            <div style={{flex:1, paddingLeft:40}}>
              <div className='div-text-profile'>
                <label>Họ và tên:</label>
                <p id='textresult'>{user.name}</p>
                <input id='textinput' className='input' placeholder={user.name}></input>
              </div>
              {/* <div className='div-text-profile'>
                <label>Ngày sinh:</label>
                <p id='textresult1'>31/12/2001</p>
                <input id='textinput1' className='input'></input>
              </div> */}
              <div className='div-text-profile'>
                <label>Giới tính:</label>
                <p id='textresult2'>{user.gender}</p>
                <Box sx={{ minWidth: 120, marginLeft: 2, marginTop: -0.75}} id='textinput2' className='input'>
                <FormControl fullWidth size='small'  >
                  <Select
                    value={gender}
                    onChange={handleChange}
                  >
                    <MenuItem value={0}>Nam</MenuItem>
                    <MenuItem value={1}>Nữ</MenuItem>
                    <MenuItem value={2}>Khác</MenuItem>
                  </Select>
                </FormControl>
                </Box>
              </div>
              <div className='div-text-profile'>
                <label>Số điện thoại:</label>
                <p id='textresult3'>{user.phone}</p>
                <input id='textinput3' className='input' placeholder={user.phone}></input>
              </div>
              <div className='div-text-profile'>
                <label>Địa chỉ email:</label>
                <p id='textresult4'>{user.email}</p>
                <input id='textinput4' className='input' placeholder={user.email}></input>
              </div>
            </div>
          </div>
  
          <div id='listButton' className='list-action-profile'>
            <Button variant='outlined' onClick={() => showhideFunction() }>Hủy</Button>
            <Button variant='outlined'>Lưu</Button>
          </div>
        </div>
        <div className='container-info'>
          <div className='header-title-info'>
            <h4 className='title-profile-1'>Mô tả bản thân</h4>
            <h5 onClick={() => showhideFunction1() } >Edit</h5>
          </div>
          <div className='div-text-profile'>
            <p id='textresult5' className='text-description-profile'>{user.description}</p>
            <textarea id="textinput5" className='textarea-description' placeholder={user.description}></textarea>
          </div>
          <div id='listButton1' className='list-action-profile'>
            <Button variant='outlined' onClick={() => showhideFunction1() }>Hủy</Button>
            <Button variant='outlined'>Lưu</Button>
          </div>
        </div>
        <div className='container-info-last'>
          <div className='header-title-info'>
            <h4 className='title-profile-1'>Liên lạc khác</h4>
            <h5 onClick={() => showhideFunction2() }>Edit</h5>
          </div>
          <div className='div-text-profile'>
            <label>Facebook:</label>
            <p id='textresult6'>{user.facebook}</p>
            <input id="textinput6"  placeholder={user.facebook}></input>
          </div>
          <div id='listButton2' className='list-action-profile'>
            <Button variant='outlined' onClick={() => showhideFunction2() }>Hủy</Button>
            <Button variant='outlined'>Lưu</Button>
          </div>
        </div>
        
      </div>
      <div style={{flex: 1}}>
        <div className='div-image'>
          <img className='imageInfo' src={ImageInfo} alt="ảnh logo"/>
          <h1 className='name-logo'>School Club Management</h1>
        </div>
        <div style={{border: "1px solid #ccc", borderRadius: 5, margin: 20,marginLeft:0,marginTop:20, height: "50vh", backgroundColor:'white'}}>
          <div style={{display:"flex", borderBottom: "1px solid #ccc", alignItems:"center" }}>
            <div style={{padding:10, paddingLeft: 25}}>
            <KeyIcon sx={{fontSize: "2.5rem",transform: "rotate(-45deg)"}}></KeyIcon>
            </div>
            <div style={{lineHeight:1.4}}>
            <h4 className='title-reset-pass'>Đổi mật khẩu</h4>
            <p style={{width:500, color: "grey", fontFamily:"arial", fontSize: "14px"}}>Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu khác</p>
            </div>
          </div>
          <div style={{borderBottom: "1px solid #ccc"}}>
            <div className='div-text-password'>
              <label>Mật khẩu hiện tại:</label>
              <input></input>
            </div>
            <div className='div-text-password'>
              <label>Mật khẩu mới:</label>
              <input></input>
            </div>
            <div className='div-text-password'>
              <label>Nhập lại mật khẩu mới:</label>
              <input></input>
            </div>
            <div style={{padding:20}} >
              <label style={{color:"#1976d2", marginLeft:100, cursor:'pointer'}}>Bạn quên mật khẩu ?</label>
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