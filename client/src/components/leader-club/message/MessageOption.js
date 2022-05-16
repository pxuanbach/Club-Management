import React from 'react'
import './MessageOption.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function showhideOption(){
  var optionList = document.getElementById("extend-option");    

  if (optionList.className == "div-option")    
  {    
    optionList.className = "div-option-extend";
    document.getElementById("expand_more").style.display = "none"; 
    document.getElementById("expand_less").style.display = "block"; 

  } else    
  {      
    optionList.className = "div-option";  
    document.getElementById("expand_more").style.display = "block";
    document.getElementById("expand_less").style.display = "none"; 
  }  

}
function showhideOption2(){
  var optionList = document.getElementById("extend-option2");    
  if (optionList.className == "div-option2")    
  {    
    optionList.className = "div-option-extend2";    
    document.getElementById("expand_more1").style.display = "none"; 
    document.getElementById("expand_less1").style.display = "block";   
  } else    
  {      
    optionList.className = "div-option2";  
    document.getElementById("expand_more1").style.display = "block";
    document.getElementById("expand_less1").style.display = "none"; 
    
  }  

}
const MessageOption = () => {

  return (
    <div className='div-extend'>
      <div className="edit-chat" onClick={()=>showhideOption()}>
          Tùy chỉnh đoạn chat
          <ExpandMoreIcon id="expand_more" className='icon-expand'></ExpandMoreIcon>
          <ExpandLessIcon id="expand_less" className='icon-expand'></ExpandLessIcon>
      </div>
      <div id="extend-option" className='div-option'>
        <div className='option'>
          <EditIcon className='edit-icon'></EditIcon>
          Đổi tên đoạn chat
        </div>
        <div className='option'>
          <ImageIcon className='edit-icon'></ImageIcon>
          Thay ảnh đoạn chat
        </div>
      </div>

      <div className="edit-chat" onClick={()=>showhideOption2()}>
          Thành viên trong đoạn chat
          <ExpandMoreIcon id="expand_more1" className='icon-expand'></ExpandMoreIcon>
          <ExpandLessIcon id="expand_less1" className='icon-expand'></ExpandLessIcon>
      </div>
      <div id="extend-option2" className='div-option2'>
        <div className='option2'>
          <div className='avt-people'></div>
          Nguyễn Tiến Đạt
        </div>
        <div className='option2'>
          <div className='avt-people'></div>
          Phạm Xuân Bách
        </div>

      </div>
    </div>
    
  )
}

export default MessageOption