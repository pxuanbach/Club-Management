import React, { useState } from 'react'
import image1 from '../../../assets/anhminhhoa.jpg'
import './Card.scss'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CardDetail from './CardDetail'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 3,
  height: '100%',
  overflowY: 'scroll'
};
const Card = ({ card, isLeader, getColumnsActivity, isFinished }) => {
  const [showFormCardDetail, setShowFormCardDetail] = useState(false);

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
          <CardDetail
            setShowForm={setShowFormCardDetail}
            card={card}
            isLeader={isLeader}
            isFinished={isFinished}
            getColumnsActivity={getColumnsActivity}
          />
        </Box>
      </Modal>

      <div className='card-item' onClick={() => setShowFormCardDetail(true)}>
        {card.title}
      </div>
    </div>

  )
}

export default Card