import React from 'react'
import image1 from '../../../assets/anhminhhoa.jpg' 
import './Card.scss'
const Card = (props) => {
  const {card} = props
  return (
    <div className='card-item'>
      {card.cover && 
        <img 
          src={card.cover} 
          className='card-cover' 
          alt='hình ảnh minh họa' 
          onMouseDown={e => e.preventDefault()}
        />}
      {card.title}
    </div>

  )
}

export default Card