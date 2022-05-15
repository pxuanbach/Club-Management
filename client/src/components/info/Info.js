import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './Info.css'
const Info = () => {
  const showhideFunction = () => {
    var actionList = document.getElementById("listButton");    
    if (actionList.className === "list-action-profile")    
    {    
      actionList.className = "display-list-button";  
      document.getElementById("textinput").style.display = "block";
      document.getElementById("textinput1").style.display = "block";
      document.getElementById("textinput2").style.display = "block";
      document.getElementById("textinput3").style.display = "block";
      document.getElementById("textinput4").style.display = "block";
      document.getElementById("textresult").style.display = "none";
      document.getElementById("textresult1").style.display = "none";
      document.getElementById("textresult2").style.display = "none";
      document.getElementById("textresult3").style.display = "none";
      document.getElementById("textresult4").style.display = "none";
    } else    
    {      
      actionList.className = "list-action-profile";  
      document.getElementById("textinput").style.display = "none";
      document.getElementById("textinput1").style.display = "none";
      document.getElementById("textinput2").style.display = "none";
      document.getElementById("textinput3").style.display = "none";
      document.getElementById("textinput4").style.display = "none";
      document.getElementById("textresult").style.display = "block";
      document.getElementById("textresult1").style.display = "block";
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
    <div>
      <div className='div-infor'>
        <h3 className='title-profile'>Thông tin cá nhân</h3> 
        <div className='container-info'>
          <h4 className='title-profile-1'>Ảnh hồ sơ</h4>
          <div className='div-action-image'>
            <div className='image'></div>
            <div className='list-action-image'>
              <Button variant='text'>Xóa ảnh</Button>
              <Button variant='text'>Thay đổi ảnh</Button>
            </div>
          </div>
        </div>
        <div className='container-info'>
          <div className='header-title-info'>
            <h4 className='title-profile-1'>Thông tin chung</h4>
            <h5 onClick={() => showhideFunction() }>Edit</h5>
          </div>
          <div className='div-text-profile'>
            <label>Họ và tên:</label>
            <p id='textresult'>Nguyễn Tiến Đạt</p>
            <input id='textinput' className='input'></input>
          </div>
          <div className='div-text-profile'>
            <label>Ngày sinh:</label>
            <p id='textresult1'>31/12/2001</p>
            <input id='textinput1' className='input'></input>
          </div>
          <div className='div-text-profile'>
            <label>Giới tính:</label>
            <p id='textresult2'>Nam</p>
            <select id='textinput2' className='input'>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
          <div className='div-text-profile'>
            <label>Số điện thoại:</label>
            <p id='textresult3'>0123456789</p>
            <input id='textinput3' className='input'></input>
          </div>
          <div className='div-text-profile'>
            <label>Địa chỉ email:</label>
            <p  id='textresult4'>datdeptrai@gmail.com</p>
            <input id='textinput4' className='input'></input>
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
            <p id='textresult5'>Tôi là một con người trầm tính. Đam mê và nhiệt huyết với công việc.aaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
              <textarea id="textinput5" className='textarea-description'></textarea>
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
            <p id='textresult6'>https://www.facebook.com/</p>
            <input id="textinput6"></input>
          </div>
          <div id='listButton2' className='list-action-profile'>
            <Button variant='outlined' onClick={() => showhideFunction2() }>Hủy</Button>
            <Button variant='outlined'>Lưu</Button>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Info