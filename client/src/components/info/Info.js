import React from 'react'
import Button from '@mui/material/Button';
import './Info.css'
const Info = () => {
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
            <h5>Edit</h5>
          </div>
          <div className='div-text-profile'>
            <label>Họ và tên:</label>
            <p>Nguyễn Tiến Đạt</p>
            <input></input>
          </div>
          <div className='div-text-profile'>
            <label>Ngày sinh:</label>
            <p>31/12/2001</p>
            <input></input>
          </div>
          <div className='div-text-profile'>
            <label>Giới tính:</label>
            <p>Nam</p>
            <select>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
          <div className='div-text-profile'>
            <label>Số điện thoại:</label>
            <p>0123456789</p>
            <input></input>
          </div>
          <div className='div-text-profile'>
            <label>Địa chỉ email:</label>
            <p>datdeptrai@gmail.com</p>
          </div>
        </div>
        <div className='container-info'>
          <div className='header-title-info'>
            <h4 className='title-profile-1'>Liên lạc khác</h4>
            <h5>Edit</h5>
          </div>
          <div className='div-text-profile'>
            <label>Facebook:</label>
            <p>https://www.facebook.com/</p>
            <input></input>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info