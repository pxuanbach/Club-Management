import React, { useState, useEffect, useContext } from 'react'
import AddClub from './AddClub';
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import io from 'socket.io-client'
import "./Home.css";
import ClubItem from './ClubItem';
import {ENDPT} from '../../helper/Helper';
import { Link, Redirect } from 'react-router-dom'
import {UserContext} from '../../UserContext'

let socket;

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

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
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormAddClub}
        onClose={() => {
          setShowFormAddClub(false);
        }}
        BackdropComponent={Backdrop}
      >
        <AddClub setShowFormAddClub={setShowFormAddClub} />
      </StyledModal>

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