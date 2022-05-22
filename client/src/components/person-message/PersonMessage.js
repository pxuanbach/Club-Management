import React from 'react'
import './PersonMessage.css'
import ItemMessage from './ItemMessage'
import Divider from '@mui/material/Divider';
const PersonMessage = () => {

  return (
    <div className='container-private-message'>
        <div className='container-left'>
            <div className='header-left'>
                <h2>Message</h2>
                <div className='btn-icon-create'>
                    <i class="fa-solid fa-square-pen"></i>
                </div>
            </div>
            <div className='container-search-mess'>
            <div className='div-search-mess'>
                <input 
                    type="text"
                    placeholder="Tìm kiếm câu lạc bộ"
                />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <Divider />
        </div>
        <div className='container-item-message'>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
            <ItemMessage/>
        </div>
        </div>
        <div className='container-right'>
            
        </div>
    </div>

  )
}

export default PersonMessage