import React, { useState, useEffect, useContext } from 'react'
import {
  Modal, Button, Tooltip, Box, TextField, styled,
  Alert, Snackbar, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { UserContext } from '../../../UserContext';
import AddFund from './AddFund';
import PaymentList from "./PaymentList"
import NumberFormat from 'react-number-format';
import { Buffer } from 'buffer';
import axiosInstance from '../../../helper/Axios';
import "./Fund.css"
import "../../../assets/css/grid.css"
import '../../manage/Mng.css'

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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const Fund = ({ club_id }) => {
  let date = new Date();
  let isTreasurer = false;
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState();
  const [club, setClub] = useState();
  const [fundHistorys, setFundHistorys] = useState([])
  const [showFormAddFund, setShowFormAddFund] = useState(false);
  const [collectInMonth, setCollectInMonth] = useState(0);
  const [payInMonth, setPayInMonth] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChangeSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleSearchFund = (e) => {
    e.preventDefault();
    if (search) {
      const encodedSearch = new Buffer(search).toString('base64');
      axiosInstance.get(`/fund/search/${club_id}/${encodedSearch}`)
      .then(response => {
        //response.data
        setFundHistorys(response.data)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
    } else {
      getFundHistories()
    }
  }

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const fundHistoryCreated = (data) => {
    setClub(prevClub => ({
      ...prevClub,
      fund: data.fund
    }))
    if (data.fundHistory.type === 'Thu') {
      setCollectInMonth(collectInMonth + data.fundHistory.total)
    } else {
      setPayInMonth(payInMonth + data.fundHistory.total)
    }
    setFundHistorys([...fundHistorys, data.fundHistory])
  }

  const getColPayInMonth = (club_id) => {
    axiosInstance.get(`/fund/colpayinmonth/${club_id}`)
    .then(response => {
      //response.data
      setCollectInMonth(response.data.collect)
      setPayInMonth(response.data.pay)
    }).catch(err => {
      //err.response.data.error
      showSnackbar(err.response.data.error)
    })
  }

  const getClub = (club_id) => {
    axiosInstance.get(`/club/one/${club_id}`)
    .then(response => {
      //response.data
      setClub(response.data)
      setIsLoading(false)
    }).catch(err => {
      //err.response.data.error
      showSnackbar(err.response.data.error)
    })
  }

  const getFundHistories = () => {
    axiosInstance.get(`/fund/list/${club_id}`)
      .then(response => {
        //response.data
        setFundHistorys(response.data)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  useEffect(() => {
    getClub(club_id)
    getColPayInMonth(club_id)
    getFundHistories()
  }, [])

  if (user) {
    isTreasurer = user._id === club?.treasurer._id
  }
  return (
    <div className='div-fund'>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>
      <Modal
        open={showFormAddFund}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          setShowFormAddFund(false);
        }}
      >
        <Box sx={style}>
          <AddFund
            setShowFormAdd={setShowFormAddFund}
            club_id={club_id}
            user={user}
            fundHistoryCreated={fundHistoryCreated}
            showSnackbar={showSnackbar}
          />
        </Box>
      </Modal>
      {isLoading ?
        <Box className='loading-temp'>
          <CircularProgress />
        </Box> :
        <>
          <div>
            <h2 className='title-header'>Tổng quan</h2>
            <div className="dashboard-overview">
              <div className="dashboard-overview-row">
                <div className="dashboard-overview-row-cell">
                  <div className='status-card'>
                    <div className='status-card_icon'>
                      {/* <PaidIcon /> */}
                    </div>
                    <div className='status-card_info'>
                      <h4>Tổng quỹ</h4>
                      <h3>
                        <NumberFormat
                          displayType='text'
                          value={club.fund}
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="dashboard-overview-row-cell">
                  <div className='status-card'>
                    <div className='status-card_icon'>

                    </div>
                    <div className='status-card_info'>
                      <h4>{"Tiền thu tháng " + (date.getMonth() + 1)}</h4>
                      <h3>
                        <NumberFormat
                          displayType='text'
                          value={collectInMonth}
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="dashboard-overview-row-cell">
                  <div className='status-card'>
                    <div className='status-card_icon'>

                    </div>
                    <div className='status-card_info'>
                      <h4>{"Tiền chi tháng " + (date.getMonth() + 1)}</h4>
                      <h3>
                        <NumberFormat
                          displayType='text'
                          value={payInMonth}
                          thousandSeparator="."
                          decimalSeparator=","
                        />
                      </h3>
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
              <PaymentList rows={fundHistorys} />
            </div>
          </div>
        </>}
    </div>
  )
}

export default Fund