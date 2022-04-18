import React from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import './AddFund.css'
const AddFund = ({ setShowFormAdd }) => {
    const [type, setType] = React.useState('');

    const handleChange = (event) => {
      setType(event.target.value);
    };
    const onExitClick = () => {
        setShowFormAdd(false);
    };
  return (
    <div>
        <h2 style={{color:'#1B264D'}}>Thêm phiếu thu/chi</h2>
        <div className='info-fund'>

            <Box sx={{ minWidth: 120, marginTop:'20px' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Loại"
                onChange={handleChange}
                size="medium"
                >
                <MenuItem value={10}>Thu</MenuItem>
                <MenuItem value={20}>Chi</MenuItem>
                </Select>
            </FormControl>
            </Box>
            <TextField fullWidth
            style={{marginTop:'18px'}}
            label="Số tiền thu/chi"
            variant="outlined"
            margin="dense"
            size="medium" />
            <TextField fullWidth
            style={{marginTop: '15px'}}
            label="Nội dung phiếu"
            variant="outlined"
            multiline
            rows={4}
            margin="dense"
            size="small" />
            <TextField fullWidth
            style={{marginTop:'18px'}}
            label="Đường dẫn liên kết"
            variant="outlined"
            margin="dense"
            size="medium" />
        </div>
        <div className='div-todo-fund'>
            <Button 
                onClick={onExitClick}
                variant="outlined"
                disableElevation>
                Hủy
            </Button>
            <Button 
                variant="outlined"
                disableElevation>
                Lưu
            </Button>
        </div>
    </div>
  )
}

export default AddFund