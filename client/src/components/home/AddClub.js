import React, {useState,useRef} from 'react'
import "./AddClub.css"
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
const AddClub = ({setShowFormAddClub})=>{
    const onExitClick = () => {
        setShowFormAddClub(false);
      };
    return(
        <div className='div-add'>
            <div className='div-info'>
                <div className='title'>
                    Tạo câu lạc bộ mới
                    <p>Cộng tác chặt chẽ với một nhóm người trong tổ chức của bạn dựa trên dự án, sáng kiến hoặc lợi ích chung.</p>
                </div>
                <div className='info'>
                    <div className='div-left'>
                        <div className='div-image'>
                            <button className='btn-image'>Chọn ảnh CLB</button>
                            {/* <label className='label1'>Ảnh minh họa</label> */}
                        </div>
                    </div>
                    <div className='div-right'>
                        <div className='div-team-name'>
                            <label className='label'>Tên câu lạc bộ</label>
                            <input className='input-name'></input>
                        </div>
                        <div className='div-description'>
                            <label className='label'>Mô tả</label>
                            <textarea className='desciption' cols="100" rows="4" placeholder="Vui lòng nhập tại đây..."></textarea>
                        </div>
                    </div>
                </div>
                <div className='div-team-search'>
                    <label className='label-search'>Thêm thành viên</label>
                    <i class="fa-solid fa-user-plus"></i>
                    <input className='input-search' placeholder="Nhập tên thành viên..."></input>
                    <AvatarGroup className='avatagroup' total={24}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                    </AvatarGroup>
                </div>
            </div>
            <div  className="div-todo">
                <button onClick={onExitClick} className='btn-exit'>
                    Cancel
                </button>
                <button className='btn-save'>
                    Save
                </button>
            </div>
        </div>
    )
}

export default AddClub