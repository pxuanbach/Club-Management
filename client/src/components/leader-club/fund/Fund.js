import React,{useState} from 'react'
import "./Fund.css"
import "../../../assets/css/grid.css"
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import PaymentList from "./PaymentList"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import '../../manage/Mng.css'
import AddFund from './AddFund';
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
const Fund = () => {
  const [showFormAddFund, setShowFormAddFund] = useState(false);

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
          <AddFund setShowFormAdd={setShowFormAddFund} />
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
          <div className='div-search-fund'>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '30ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <CustomTextField id="search-field" label="Tìm kiếm phiếu " variant="standard"  />
            </Box>
            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                className='btn-search2'
                variant="text"
                disableElevation
              >
                <i class="fa-solid fa-magnifying-glass"></i>
              </Button>
            </Tooltip>
            <Button className='btn-add-fund' variant="contained"  style={{ background: '#1B264D',marginTop:'10px', fontWeight:'600' }} onClick={() => setShowFormAddFund(true)}>Thêm phiếu</Button>
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