import React, { useState, useRef } from 'react'
import {
    Button, TextField, ToggleButton, ToggleButtonGroup,
    Tooltip, Chip, LinearProgress, Typography, Box,
    InputAdornment
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from "@mui/material/styles";
import NumberFormat from "react-number-format";
import UploadIcon from '@mui/icons-material/Upload';
import './AddFund.css';
import axiosInstance from '../../../helper/Axios'

const ColorToggleButton = styled(ToggleButton)(({ selectedColor }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
        color: 'white',
        backgroundColor: selectedColor,
        fontSize: 16,
    },
}));

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
        />
    );
}

const AddFund = ({ setShowFormAdd, club_id, user, fundHistoryCreated, showSnackbar }) => {
    const inputFile = useRef(null);
    const [type, setType] = useState('Thu');
    const [file, setFile] = useState();
    const [inputFileMessage, setInputFileMessage] = useState('Chọn tệp tải lên (word, excel, pdf,...)');
    const [total, setTotal] = useState();
    const [totalErr, setTotalErr] = useState();
    const [content, setContent] = useState();
    const [contentErr, setContentErr] = useState();
    const [suggestOptions, setSuggestOptions] = useState([]);
    const [progress, setProgress] = useState();

    function isFileImage(file) {
        //console.log(file.type)
        return file.type.includes('spreadsheetml.sheet') || file.type.includes('ms-excel');
    }

    const handleFileChange = (event) => {
        setProgress(0)
        if (isFileImage(event.target.files[0])) {
            setFile(event.target.files[0]);
        } else {
            alert('Tệp tải lên nên là tệp định dạng excel')
        }
    };

    const handleChange = (event, newValue) => {
        if (newValue !== null) {
            setType(newValue)
        }
    };

    const handleChangeTotal = (event) => {
        let value = event.target.value
        setTotal(value)
        let newOptions = [value * 10, value * 100, value * 1000];
        setSuggestOptions(newOptions)
    }

    const validateEmpty = () => {
        let isEmpty = false
        if (!total) {
            setTotalErr('Số tiền thu/chi trống')
            isEmpty = true;
        }
        if (!content) {
            setContentErr('Nội dung trống')
            isEmpty = true;
        }
        if (!file) {
            setInputFileMessage('Chưa chọn tệp nào')
            isEmpty = true;
        }

        return isEmpty;
    }

    const handleSave = (event) => {
        event.preventDefault();
        if (!validateEmpty()) {
            setTotalErr('')
            setContentErr('')
            var formData = new FormData();
            formData.append("file", file);
            formData.append("club", club_id);
            formData.append("author", user._id);
            formData.append("type", type);
            formData.append("total", total);
            formData.append("content", content);

            axiosInstance.post("/fund/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: progressEvent => {
                    const { loaded, total } = progressEvent;
                    let percent = Math.floor((loaded * 100) / total)
                    //console.log(`${loaded}kb of ${total}kb | ${percent}%`);

                    if (percent < 100) {
                        setProgress(percent)
                    }
                },
            }).then(response => {
                //response.data
                setProgress(100);
                fundHistoryCreated(response.data);
                onExitClick();
              }).catch(err => {
                  if (err.response.data.file) {
                    setInputFileMessage(err.response.data.file)
                    setFile(null)
                  } else {
                    showSnackbar(err.response.data.error)
                  }
              })
        }
    }

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
                <div>
                    <TextField
                        value={total}
                        className='fund-textfield'
                        fullWidth
                        label="Số tiền thu/chi"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                            endAdornment: <InputAdornment position="end">đ</InputAdornment>
                        }}
                        onChange={handleChangeTotal}
                        helperText={totalErr}
                        error={totalErr}
                    />
                    <div className={total ? 'total-suggest' : 'total-suggest none'}>
                        <span>Gợi ý:</span>
                        {suggestOptions.map((option, index) => (
                            <Chip key={index}
                                label={(
                                    <NumberFormat
                                        value={option}
                                        className='total-suggest-item'
                                        thousandSeparator="."
                                        decimalSeparator=","
                                    />
                                )}
                                onClick={() => setTotal(option)}
                            />

                        ))}
                    </div>
                </div>
                <TextField
                    value={content}
                    fullWidth
                    label="Nội dung phiếu"
                    variant="outlined"
                    multiline
                    rows={4}
                    size="small"
                    onChange={(e) => setContent(e.target.value)}
                    helperText={contentErr}
                    error={contentErr}
                />
                <div className='fund-uploadfile'>
                    <input style={{ display: 'none' }} type="file" ref={inputFile} onChange={handleFileChange} />
                    <Tooltip title='Chọn tệp tải lên' placement='right-start'>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={() => { inputFile.current.click() }}
                        >
                            <UploadIcon />
                        </Button>
                    </Tooltip>
                    <span className='fund-uploadfile-name'>{file ? file.name : inputFileMessage}</span>
                </div>
                {progress > 0 && <LinearProgressWithLabel value={progress} />}

            </div>
            <div className='stack-right'>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleSave}
                >
                    Lưu
                </Button>
                <Button
                    variant="outlined"
                    disableElevation
                    onClick={onExitClick}
                >
                    Hủy
                </Button>
            </div>
        </div>
    )
}

export default AddFund