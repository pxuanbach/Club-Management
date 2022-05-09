import React, { useState, useEffect, useContext } from 'react'
import { Modal, Button, Tooltip, Box, TextField, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import io from 'socket.io-client'
import { UserContext } from '../../../UserContext';
import { ENDPT } from '../../../helper/Helper';
import AddFund from './AddFund';
import PaymentList from "./PaymentList"
import "./Fund.css"
import "../../../assets/css/grid.css"
import '../../manage/Mng.css'

let socket

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-30%, -45%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const Fund = ({club_id}) => {
  let isTreasurer = false;
  const { user, setUser } = useContext(UserContext);
  const [search, setSearch] = useState();
  const [treasurer, setTreasurer] = useState();
  const [showFormAddFund, setShowFormAddFund] = useState(false);

  const handleChangeSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleSearchFund = (e) => {

  }

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('get-user', club_id, 'treasurer')
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  useEffect(() => {
    
    socket.on('output-treasurer', res => {
      setTreasurer(res)
    })
    //console.log(user._id === leader._id)
  }, [treasurer])

  if (user) { 
    isTreasurer = user._id === treasurer?._id
  }
  return (
    <div className='div-fund'>
      <Modal
        open={showFormAddFund}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          setShowFormAddFund(false);
        }}
      >
        <Box sx={style}>
          <AddFund setShowFormAdd={setShowFormAddFund} socket={socket}/>
        </Box>
      </Modal>
      <div>
        <h2 className='title-header'>Tổng quan</h2>
        <div className="dashboard-overview">
          <div className="dashboard-overview-row row">
            <div className="col-3">
              <div className='status-card'>
                <div className='status-card_icon'>
                  {/* <PaidIcon /> */}
                </div>
                <div className='status-card_info'>
                  <h4>Tổng quỹ </h4>
                  <h3>2.000.000</h3>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className='status-card'>
                <div className='status-card_icon'>

                </div>
                <div className='status-card_info'>
                  <h4>Tiền thu </h4>
                  <h3>1.000.000</h3>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className='status-card'>
                <div className='status-card_icon'>

                </div>
                <div className='status-card_info'>
                  <h4>Tiền chi </h4>
                  <h3>500.000</h3>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className='status-card'>
                <div className='status-card_icon'>

                </div>
                <div className='status-card_info'>
                  <h4>ABCDE </h4>
                  <h3>10</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='div-title-search'>
          <h2 className='title-header2'>Lịch sử thu chi</h2>
          <div className='div-search-tabmember'>
            <Box
              sx={{
                '& > :not(style)': { width: '30ch' },
              }}
            >
              <CustomTextField
                value={search}
                onChange={handleChangeSearch}
                id="search-field-tabmember"
                label="Tìm kiếm phiếu thu/chi"
                variant="standard"
                onKeyPress={event => event.key === 'Enter' ? handleSearchFund(event) : null}
              />
            </Box>
            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                className='btn-search3'
                variant="text"
                disableElevation
                onClick={handleSearchFund}
              >
                <SearchIcon sx={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            {isTreasurer ? 
            (<Button
              onClick={() => {
                setShowFormAddFund(true)
              }}
              className='btn-add-tabmember'
              variant="contained"
              disableElevation
              style={{ background: '#1B264D' }}>
              Thêm phiếu
            </Button>) : <></>}
          </div>
        </div>
        <div className='table-paymentlist'>
          <PaymentList></PaymentList>
        </div>
      </div>
    </div>
  )
}

export default Fund