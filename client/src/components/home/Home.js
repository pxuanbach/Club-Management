import React, { useState, useEffect, useContext } from 'react'
import AddClub from '../manage/modal/AddClub';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import io from 'socket.io-client'
import "./Home.css";
import ClubItem from './ClubItem';
import {ENDPT} from '../../helper/Helper';
import { Link, Redirect } from 'react-router-dom'
import {UserContext} from '../../UserContext'

let socket;

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [showFormAddClub, setShowFormAddClub] = useState(false);
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    socket.on('output-clubs', clbs => {
      setClubs(clbs)
      console.log('clubs', clubs)
    })
  }, [])

  useEffect(() => {
    socket.on('club-created', clb => {
      setClubs([...clubs, clb])
    })
  }, [clubs])

  if (!user) {
    return <Redirect to='/login'/>
  }
  return (
    <div>
      <Modal
        open={showFormAddClub}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          setShowFormAddClub(false);
        }}
      >
        <Box sx={style}>
          <AddClub setShowFormAddClub={setShowFormAddClub}/>
        </Box>
      </Modal>

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
        <div className='header-body'>
          <div className='header-title'> Câu lạc bộ của bạn</div>
          <div className='div-btnadd'>
            <button onClick={() => setShowFormAddClub(true)} className='btnAdd' >Tạo câu lạc bộ</button>
            <i class="fa-solid fa-plus"></i>
          </div>
        </div>
        <div className='div-card-team'>
          {clubs && clubs.map(club => (
            <Link key={club._id} to={'/club/' + club._id + '/' + club.name}>
              <ClubItem club={club} />
            </Link>
          ))}
        </div>

      </div>

    </div>
  )
}

export default Home