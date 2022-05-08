import React, {useState, useRef} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from "@mui/material/styles";
import './AddFund.css'

const ColorToggleButton = styled(ToggleButton)(({ selectedColor }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
        color: 'white',
        backgroundColor: selectedColor,
    },
}));

const AddFund = ({ setShowFormAdd }) => {
    const inputFile = useRef(null);
    const [type, setType] = useState('Thu');
    const [file, setFile] = useState();

    function isFileImage(file) {
        if (file[type].split('/')[1] === 'pdf')
        return true;
        //return file && file['type'].split('/')[0] === 'image';
    }

    const handleFileChange = (event) => {
        if (isFileImage(event.target.files[0])) {
            setFile(event.target.files[0]);
        } else {
            alert('Ảnh đại diện nên là tệp có đuôi .jpg, .png, .bmp,...')
        }
    };

    const handleChange = (event, newValue) => {
        setType(newValue);
    };

    const onExitClick = () => {
        setShowFormAdd(false);
    };

    return (
        <div>
            <h2 style={{ color: '#1B264D', marginBottom: 15 }}>Thêm phiếu</h2>
            <div className='info-fund'>
                <ToggleButtonGroup
                    fullWidth
                    color="primary"
                    value={type}
                    exclusive
                    onChange={handleChange}
                >
                    <ColorToggleButton selectedColor='#2E7D32' value="Thu"><b>Thu</b></ColorToggleButton>
                    <ColorToggleButton selectedColor='#D32F2F' value="Chi"><b>Chi</b></ColorToggleButton>
                </ToggleButtonGroup>
                <TextField fullWidth
                    style={{ marginTop: '18px' }}
                    label="Số tiền thu/chi"
                    variant="outlined"
                    size="small"
                    inputProps={{ type: 'number' }}
                />
                <TextField fullWidth
                    style={{ marginTop: '15px' }}
                    label="Nội dung phiếu"
                    variant="outlined"
                    multiline
                    rows={4}
                    margin="dense"
                    size="small"
                />
                <input style={{display: 'none'}} type="file" ref={inputFile} onChange={handleFileChange} />
            </div>
            <div className='stack-right'>
                <Button
                    variant="contained"
                    disableElevation
                >
                    Lưu
                </Button>
                <Button
                    variant="outlined"
                    disableElevation
                >
                    Hủy
                </Button>
            </div>
        </div>
    )
}

export default AddFund