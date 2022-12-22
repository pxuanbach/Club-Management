import React, { useState, useEffect } from 'react'
import {
  Modal, Button, Tooltip, Box, TextField, styled,
  Alert, Snackbar, CircularProgress, Stack, FormControlLabel,
  Checkbox, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddFund from './AddFund';
import PaymentList from "./PaymentList"
import NumberFormat from 'react-number-format';
import axiosInstance from '../../../helper/Axios';
import FileDownload from 'js-file-download';
import RangeDatePicker from "../activity/utilities/RangeDatePicker";
import moment from "moment";
import "./Fund.css"
import "../../../assets/css/grid.css"
import '../../manage/Mng.css';
import FundWithTypeByTime from '../../statistic/FundWithTypeByTime';
import FundGrowthByTime from '../../statistic/FundGrowthByTime';

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

const GeneralFundTab = ({ club_id, user }) => {
  let isTreasurer = false;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [club, setClub] = useState();
  const [fundHistorys, setFundHistorys] = useState([])
  const [showFormAddFund, setShowFormAddFund] = useState(false);
  const [collect, setCollect] = useState(0);
  const [pay, setPay] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [applyFilter, setApplyFilter] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(moment().startOf("month"))
  );
  const [endDate, setEndDate] = useState(new Date(moment().endOf("month")));
  const [isExpandStatistic, setIsExpandStatistic] = useState(false);

  const handleChangeSearch = (event) => {
    setSearch(event.target.value)
  }

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const exportFundFile = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance.get(`/export/fund/${club._id}/${user._id}`, {
        params: {
          applyFilter: applyFilter,
          startDate: startDate,
          endDate: endDate,
        },
        headers: { "Content-Type": "application/vnd.ms-excel" },
        responseType: 'blob'
      });
      const data = res.data;
      if (data) {
        FileDownload(data, Date.now() + `-quy_${club.name}.xlsx`)
      }
    } catch (err) {
      showSnackbar(err.response.data.error)
    }
  }

  const fundHistoryCreated = (data) => {
    setClub(prevClub => ({
      ...prevClub,
      fund: data.fund
    }))
    if (data.fundHistory.type === 'Thu' || data.fundHistory.type === 'Thu mỗi tháng') {
      setCollect(collect + data.fundHistory.total)
    } else {
      setPay(pay + data.fundHistory.total)
    }
    setFundHistorys([...fundHistorys, data.fundHistory])
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

  const getFundHistories = async () => {
    axiosInstance.get(`/fund/list/${club_id}`, {
      params: {
        applyFilter: applyFilter,
        startDate: startDate,
        endDate: endDate,
        search: search
      },
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        //response.data
        console.log(response.data)
        setFundHistorys(response.data.funds)
        setCollect(response.data.collect)
        setPay(response.data.pay)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  useEffect(() => {
    // console.log(club_id)
    getClub(club_id)
    getFundHistories()
  }, [])

  useEffect(() => {
    getFundHistories()
  }, [applyFilter, startDate, endDate])

  if (user) {
    isTreasurer = user._id === club?.treasurer._id
  }
  return (
    <>
      {user && (
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
            <Box sx={{ marginTop: 7 }}>
              <div>
                <div className="dashboard-overview">
                  <div className="dashboard-overview-row">
                    <div>
                      <Stack direction="column" spacing={1}>
                        <FormControlLabel
                          sx={{ minWidth: 'max-content' }}
                          control={
                            <Checkbox
                              checked={applyFilter}
                              onChange={(e) => setApplyFilter(e.target.checked)}
                            />
                          }
                          label="Áp dụng bộ lọc"
                        />
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ width: 'max-content' }}
                        >
                          <h3>Lọc</h3>
                          <RangeDatePicker
                            textCenter="-"
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                          />
                        </Stack>
                      </Stack>
                    </div>
                    <div className="dashboard-overview-row-cell">
                      <div className='status-card'>
                        <div className='status-card_info'>
                          <h4>Tổng quỹ</h4>
                          <h3>
                            <NumberFormat
                              displayType='text'
                              value={collect - pay}
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-overview-row-cell">
                      <div className='status-card'>
                        <div className='status-card_info'>
                          <h4>{"Tiền thu"}</h4>
                          <h3>
                            <NumberFormat
                              displayType='text'
                              value={collect}
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-overview-row-cell">
                      <div className='status-card'>
                        <div className='status-card_info'>
                          <h4>{"Tiền chi"}</h4>
                          <h3>
                            <NumberFormat
                              displayType='text'
                              value={pay}
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
              <Box sx={{ width: '100%', p: 2, transition: '0.5s' }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={isExpandStatistic ? 12 : 6}>
                    <FundWithTypeByTime
                      club={club}
                      isExpand={isExpandStatistic}
                      expand={() => setIsExpandStatistic(!isExpandStatistic)}
                    />
                  </Grid>
                  <Grid item xs={isExpandStatistic ? 12 : 6}>
                    <FundGrowthByTime
                      club={club}
                      isExpand={isExpandStatistic}
                      expand={() => setIsExpandStatistic(!isExpandStatistic)}
                    />
                  </Grid>
                </Grid>

              </Box>
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
                        onKeyPress={event => event.key === 'Enter' ? getFundHistories() : null}
                      />
                    </Box>
                    <Tooltip title='Tìm kiếm' placement='right-start'>
                      <Button
                        className='btn-search3'
                        variant="text"
                        disableElevation
                        onClick={getFundHistories}
                      >
                        <SearchIcon sx={{ color: '#1B264D' }} />
                      </Button>
                    </Tooltip>
                    {isTreasurer ?
                      <Stack direction="row" spacing={0.6}>
                        <Button
                          onClick={() => {
                            setShowFormAddFund(true)
                          }}
                          variant="contained"
                          disableElevation
                          style={{ background: '#1B264D' }}>
                          Thêm phiếu
                        </Button>
                        <Button
                          onClick={exportFundFile}
                          style={{ background: "#1B264D", minWidth: '140px' }}
                          variant="contained"
                          disableElevation
                          startIcon={<i class="fa-solid fa-file-export"></i>}
                        >
                          Xuất file
                        </Button>
                      </Stack> : <></>}
                  </div>
                </div>
                <div className='table-paymentlist'>
                  <PaymentList rows={fundHistorys} />
                </div>
              </div>
            </Box>}
        </div>
      )}
    </>
  )
}

export default GeneralFundTab