import React, { useState, useEffect, useContext } from 'react'
import AddClub from '../manage/modal/AddClub';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    let isAdmin = user?.username.includes('admin');
    socket.emit('get-clubs', user?._id, isAdmin)
  }, [user])

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
    socket.on('member-added', (user_id, clb) => {
      if (user._id === user_id) {
        setClubs([...clubs, clb])
      }
    })
    socket.on('removed-user-from-club', (club_id, userRemoved) => {
      if (user._id === userRemoved._id) {
        setClubs(clubs.filter(club => club._id !== club_id))
      }
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
          <AddClub setShowFormAdd={setShowFormAddClub}/>
        </Box>
      </Modal>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message="Câu lạc bộ này đã bị chặn"
      />

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
          {user.username.includes('admin') ? 
          (<div className='div-btnadd'>
            <button onClick={() => setShowFormAddClub(true)} className='btnAdd' >Tạo câu lạc bộ</button>
            <i class="fa-solid fa-plus"></i>
          </div>) : null}
        </div>
        <div className='div-card-team'>
          {clubs && clubs.map(club => (
            <Link key={club._id} 
              style={{textDecoration: 'none'}}
              to={club.isblocked ? '' : '/club/' + club._id + '/' + club.name + '/message'}
              onClick={() => {
                setOpenSnackbar(true)
              }}>
              <ClubItem club={club}/>
            </Link>
          ))}
        </div>
      
      </div>

    </div>
  )
}

export default Home