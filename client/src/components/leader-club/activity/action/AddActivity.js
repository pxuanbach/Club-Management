import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material';
import io from 'socket.io-client'
import RangeDatePicker from '../utilities/RangeDatePicker'
import { ENDPT } from '../../../../helper/Helper';

let socket

const AddActivity = ({ setShow, club_id }) => {
    const date = new Date();
    const [content, setContent] = useState();
    const [contentErr, setContentErr] = useState('');
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
        if (content) {
            socket.emit('create-activity',
                club_id,
                content,
                validateDate(startDate),
                validateDate(endDate)
            )
        } else {
            setContentErr('Tên hoạt động trống')
        }
    }

    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

    return (
        <div>
            <h2 id="modal-modal-title">
                Thêm hoạt động mới
            </h2>
            <div id="modal-modal-description">
                <div className='addgroup-modal'>
                    <TextField
                        value={content}
                        size="small"
                        label="Tên hoạt động"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={(event) => {
                            setContentErr('')
                            setContent(event.target.value);
                        }}
                        helperText={contentErr}
                        error={contentErr}
                    />
                    <RangeDatePicker
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