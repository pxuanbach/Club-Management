import React, { useState, useEffect, useContext } from 'react'
import AddClub from '../manage/modal/AddClub';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import "./Home.css";
import ClubItem from './ClubItem';
import axiosInstance from '../../helper/Axios'
import { Link, Redirect } from 'react-router-dom'
import {UserContext} from '../../UserContext'
import { Buffer } from 'buffer';

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
  const [search, setSearch] = useState()
  const [clubs, setClubs] = useState([])

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const encodedSearch = new Buffer(search).toString('base64');
      const res = await axiosInstance.get(`/club/search/${encodedSearch}`)

      const data = res.data;
      //console.log(data)
      if (data) {
        setClubs(data)
      }
    } else {
      getListClub()
    }
  }

  const getListClub = async () => {
    let isAdmin = user?.username.includes('admin');
    let res = await axiosInstance.get(`/club/list/${isAdmin}/${user._id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    let data = res.data
    if (data) {
      setClubs(data)
    }
  }

  useEffect(() => {
    getListClub()
  }, [])

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
          <AddClub setShowFormAdd={setShowFormAddClub} clubs={clubs} setClubs={setClubs}/>
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
            value={search}
            type="text"
            placeholder="Tìm kiếm câu lạc bộ"
            onChange={handleChangeSearch}
            onKeyPress={event => event.key === 'Enter' ? handleSearch(event) : null}
          />
          <i onClick={handleSearch} class="fa-solid fa-magnifying-glass"></i>
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