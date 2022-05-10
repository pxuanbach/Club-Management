import React,{useState} from 'react'
import image1 from '../../../assets/anhminhhoa.jpg' 
import './Card.scss'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CardDetail from './CardDetail'
import { styled } from '@mui/material/styles';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  
};
const Card = (props) => {
  const [showFormCardDetail, setShowFormCardDetail] = useState(false);
  const {card} = props
  return (
    <div>
      <Modal
        open={showFormCardDetail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          setShowFormCardDetail(false);
        }}
      >
        <Box sx={style}>
          <CardDetail  setShowForm={setShowFormCardDetail}/>
        </Box>
      </Modal>
    
    <div className='card-item' onClick={() => setShowFormCardDetail(true)}>

      {card.cover && 
        <img 
          src={card.cover} 
          className='card-cover' 
          alt='hình ảnh minh họa' 
          onMouseDown={e => e.preventDefault()}
        />}
      {card.title}
      
    </div>
    </div>

  )
}

export default Card