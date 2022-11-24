import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import RangeDatePicker from '../utilities/RangeDatePicker';
import axiosInstance from '../../../../helper/Axios';

const AddActivity = ({ setShow, club_id, acitivityCreated, showSnackbar }) => {
    const date = new Date();
    const [title, setTitle] = useState();
    const [titleErr, setTitleErr] = useState('');
    const [startDate, setStartDate] = useState(date.setDate(date.getDate()));
    const [endDate, setEndDate] = useState(date.setDate(date.getDate() + 14));

    const handleClose = () => {
        setShow(false)
    }

    const validateDate = (value) => {
        if (typeof value === 'number') {
            return value;
        } else {
            return Date.parse(value);
        }
    }

    const handleSave = (event) => {
        event.preventDefault();
        if (title) {
            axiosInstance.post(`/activity/create`,
                JSON.stringify({
                    "club": club_id,
                    "title": title,
                    "startDate": validateDate(startDate),
                    "endDate": validateDate(endDate)
                }), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                //response.data
                acitivityCreated(response.data)
                handleClose()
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error)
            })
        } else {
            setTitleErr('Tên hoạt động trống')
        }
    }

    return (
        <div>
            <h2 id="modal-modal-title">
                Thêm hoạt động mới
            </h2>
            <div id="modal-modal-description">
                <div className='addgroup-modal'>
                    <TextField
                        value={title}
                        size="small"
                        label="Tên hoạt động"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={(event) => {
                            setTitleErr('')
                            setTitle(event.target.value);
                        }}
                        helperText={titleErr}
                        error={titleErr}
                    />
                    <RangeDatePicker
                        startDateTitle="Ngày bắt đầu"
                        endDateTitle="Ngày kết thúc"
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                    <div className='stack-right'>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            disableElevation
                            onClick={handleClose}>
                            Hủy
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddActivity