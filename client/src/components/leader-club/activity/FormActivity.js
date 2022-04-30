import React from 'react'
import './FormActivity.scss'
import image1 from '../../../assets/anhminhhoa.jpg' 
const FormActivity = ({ setShowForm }) => {

  return (
    <div  className='div-detail-activity'>
      <div className='board-columns'>
        
        <div className='column'>
          <header>Cần làm</header>
          <ul>
            <li>
              <img src={image1}/>
              Title: Làm slide
            </li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
          </ul>
          <footer>Thêm thẻ khác</footer>
        </div>
        <div className='column'>
          <header>Đang làm</header>
          <ul>
            <li>
              <img src=''/>
              Title: Làm slide
            </li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
          </ul>
          <footer>Thêm thẻ khác</footer>
        </div>
        <div className='column'>
          <header>Đã xong</header>
          <ul>
            <li>
              <img src=''/>
              Title: Làm slide
            </li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
          </ul>
          <footer>Thêm thẻ khác</footer>
        </div>
        <div className='column'>
          <header>Tổng kết</header>
          <ul>
            <li>
              <img src=''/>
              Title: Làm slide
            </li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
            <li>Add what you'd like to work on below</li>
          </ul>
          <footer>Thêm thẻ khác</footer>
        </div>


      </div>
    </div>
  )
}

export default FormActivity




