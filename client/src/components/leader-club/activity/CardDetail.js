import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Button, TextareaAutosize } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import './CardDetail.css'
import MemberAssgin from './MemberAssign';

const CardDetail = ({ setShowForm }) => {
    const onExitClick = () => {
        setShowForm(false);
    };
    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const [show,setShow] = useState(false)
    const [showCardProfile,setShowCardProfile] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextareaRef = useRef(null)


    useEffect(() => {
        if(newCardTextareaRef && newCardTextareaRef.current){
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openNewCardForm])

    const showhideFunction = () => {
        var actionList = document.getElementById("actionOfText");    
        if (actionList.className === "not-display")    
        {    
          actionList.className = "display";    
        } else    
        {      
          actionList.className = "not-display";  
        } 
    }

  return (
    <div>
        <div className='button-close' onClick={() => onExitClick()}>
            <i className="fa-solid fa-xmark"></i>
        </div>
        <div className='title-card'>  
            <i class="fa-solid fa-window-maximize"></i>
            <h3>Title of card 1</h3>
        </div>
        <div className='body-card-detail'>
            <div className='div-left-card-detail'>
                <div className='display-member-attend'>
                    <h5 style={{color:'#1B264D', fontSize: '16px', marginBottom: 5}}>Thành viên</h5>
                    <div className="avatar-display">
                    <Stack direction="row" spacing={0.5}>
                        <Avatar sx={{width: 38, height: 38, cursor: 'pointer', fontSize:'16px'}}  alt="Remy Sharp" src="/static/images/avatar/1.jpg" onClick={ ()=>setShowCardProfile(true)}/>
                    </Stack>
                    {showCardProfile?
                    <div className='card-profile'>
                        <i class="fa-solid fa-xmark" onClick={ ()=>setShowCardProfile(false)}></i>
                        <div className='container-info-profile'>
                            <div style={{marginLeft: 30, marginTop: '30px'}}> 
                            <h3>Nguyễn Tiến Đạt</h3>
                            <h4 style={{fontWeight: 'lighter'}}>abc@gmail.com</h4>
                            </div>
                        </div>
                        <Avatar sx={{width: 90, height: 90, cursor: 'pointer', fontSize:'16px', position:'absolute', top: 20,left: 18}}  />
                        <div className='button-delete'>
                            Gỡ khỏi thẻ
                        </div>
                        <div className='button-info'>
                            Xem hồ sơ
                        </div>
                    </div>:null}
                    </div>
                </div>
                <div style={{display:'flex', width: '100%', marginTop: 20}}>
                    <i style={{marginTop: '10px', fontSize: '20px', paddingRight: '15px',color:'#1B264D'}} class="fa-solid fa-bars"></i>
                    <div className='description'>  
                        <h4>Mô tả</h4>
                        {openNewCardForm &&
                            <div className='text-area'>
                                <TextareaAutosize
                                aria-label="minimum height"
                                minRows={6}
                                placeholder="Thêm mô tả chi tiết hơn..."
                                className='textarea-enter-description'
                                ref={newCardTextareaRef}
                                />
                            </div>
                        }
                        {openNewCardForm &&
                        <div className='add-new-description-action'>
                            <Button variant="contained" >Lưu</Button>
                            <span className='cancel-icon'  onClick={toggleOpenNewCardForm}>
                                <i className="fa fa-trash icon" />
                            </span>
                        </div>
                        }
                        {!openNewCardForm &&
                            <div className='add-description-area' onClick={toggleOpenNewCardForm}>
                                <h5 className>Thêm mô tả chi tiết hơn</h5>
                            </div>
                        }
                    </div>
                </div>
                <div style={{display:'flex', width: '100%'}}>
                    <i  style={{marginTop: '35px', fontSize: '20px', paddingRight: '15px', color:'#1B264D'}} class="fa-solid fa-list-check"></i>
                    <div className='description-activity'>    
                        <h4>Hoạt động</h4>
                        <div className='comment-area' >
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Viết bình luận..."
                                className='textarea-enter-comment'
                                onClick={() => showhideFunction() }
                                // ref={newCardTextareaRef}
                            />
                            <div id="actionOfText" className="not-display">
                                <div className='btn-save-text'>Lưu</div>
                                <div className='list-action-for-text'>
                                <Tooltip title="Đính kèm">
                                    <IconButton className='icon-button-text'>
                                        <i class="fa-solid fa-paperclip"></i>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Đề cập thành viên">
                                    <IconButton className='icon-button-text'>
                                        <AlternateEmailIcon                                     
                                        sx={{
                                            fontSize: 20,
                                            color: "#1B264D", 
                                
                                        }}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Thêm biểu tượng cảm xúc">
                                    <IconButton className='icon-button-text'>
                                        <SentimentSatisfiedAltIcon 
                                        sx={{
                                            fontSize: 20,
                                            color: "#1B264D", 
                                
                                        }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='div-right-card-detail'>
                <div className='action-1'>
                    <h4 className='title-action'>Đã gợi ý</h4>
                    <button  className='btn-action'>
                        <i class="fa-solid fa-user"></i>
                        Tham gia</button>
                </div>
                <div className='action-2'>
                    <h4 className='title-action'>Thêm vào thẻ</h4>
                    <button className='btn-action' onClick={ ()=>setShow(true)}>
                        <i class="fa-solid fa-user-plus"></i>
                        Thành viên
                    </button>
                    {
                        show?<MemberAssgin setShow={setShow}/>:null
                    }
                    <button  className='btn-action'>
                        <i class="fa-solid fa-clipboard-list"></i>
                        Việc cần làm
                    </button>
                    <button  className='btn-action'>
                        <i class="fa-solid fa-clock"></i>
                        Ngày</button>
                    <button  className='btn-action'>
                        <i class="fa-solid fa-paperclip"></i>
                        Đính kèm</button>
                </div>
            </div>

            

        </div>
    </div>
  )
}

export default CardDetail