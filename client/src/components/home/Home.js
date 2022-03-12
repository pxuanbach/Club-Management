import React from 'react'
import "./Home.css";
const Home = () => {
  return (
    <div>
      <div className='div-header'>
        <div className='div-search'>
          <input
              type="text"
              placeholder="Tìm kiếm câu lạc bộ"

            />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      
      <div className='div-body'>
        <div className='header-title'> Câu lạc bộ của bạn</div>
        <div className='div-card-team'>
            <div className='card-team'>
            <i className="fa-solid fa-ellipsis"></i>
              <div className='image-team'>

              </div>
              <div className='name-team'>
                  CLB Chạy bộ
              </div>
              <div className='div-activity'>

              </div>
              
            </div>
        </div>

      </div>

    </div>
  )
}

export default Home