import React, { useState, useEffect, useRef } from 'react'
import './MemberAssign.css'

const MemberAssgin = ({setShow}) => {
    return(
        <div className='container-memberassign'>
            <div className='header-memberassign'>
                <i class="fa-solid fa-xmark" onClick={() => setShow(false)}></i>
                <h3 className='title-header-memberassign'>Nhóm</h3> 
            </div>
            <div>
                <div className='div-search-memberassign'>
                    <input 
                        type="text"
                        placeholder="Tìm nhóm"
                    />
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
            </div>
        </div>
    )
}

export default MemberAssgin