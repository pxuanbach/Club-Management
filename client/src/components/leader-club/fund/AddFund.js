import React, { useState, useRef } from 'react'
import {
    Button, TextField, ToggleButton, ToggleButtonGroup,
    Tooltip, Chip
} from '@mui/material';
import { styled } from "@mui/material/styles";
import NumberFormat from "react-number-format";
import UploadIcon from '@mui/icons-material/Upload';
import { my_API } from '../../../helper/Helper'
import './AddFund.css';

const ColorToggleButton = styled(ToggleButton)(({ selectedColor }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
        color: 'white',
        backgroundColor: selectedColor,
        fontSize: 16,
    },
}));

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

const AddFund = ({ setShowFormAdd, socket }) => {
    const inputFile = useRef(null);
    const [type, setType] = useState('Thu');
    const [file, setFile] = useState();
    const [inputFileMessage, setInputFileMessage] = useState('Chọn tệp tải lên (word, excel, pdf,...)');
    const [total, setTotal] = useState();
    const [totalErr, setTotalErr] = useState();
    const [content, setContent] = useState();
    const [contentErr, setContentErr] = useState();
    const [suggestOptions, setSuggestOptions] = useState([]);

    function isFileImage(file) {
        //console.log(file.type)
        return file.type.includes('spreadsheetml.sheet');
    }

    const handleFileChange = (event) => {
        if (isFileImage(event.target.files[0])) {
            setFile(event.target.files[0]);
        } else {
            alert('Tệp tải lên nên là tệp có đuôi excel')
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

        return isEmpty;
    }

    const handleSave = async (event) => {
        event.preventDefault();

        if (!validateEmpty()) {
            var formdata = new FormData();
            formdata.append("file", file);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            const res = await fetch("http://localhost:5000/upload", requestOptions)
            const uploadResult = await res.json();
            
            if (uploadResult.error) {
                setInputFileMessage(uploadResult.error.message)
                setFile(null)
            }
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
                            inputComponent: NumberFormatCustom
                        }}
                        onChange={handleChangeTotal}
                        helperText={totalErr}
                        error={totalErr}
                    />
                    <div className={total ? 'total-suggest' : 'total-suggest none'}>
                        <span>Gợi ý:</span>
                        {suggestOptions.map((option) => (
                            <Chip
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