import React, { useState, forwardRef } from 'react'
import { Button } from '@mui/material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './RangeDatePicker.css'

const RangeDatePicker = ({startDate, endDate, setStartDate, setEndDate}) => {

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <Button
            sx={{fontSize: 15}}
            fullWidth
            variant="outlined"
            disableElevation
            onClick={onClick}
            ref={ref}
        >
            {value}
        </Button>
    ));

    return (
        <div className='range-datepicker'>
            <div className='range-datepicker__start'>
                <h3>Ngày bắt đầu</h3>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selectsStart
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    startDate={startDate}
                    endDate={endDate}
                    customInput={<CustomInput />}
                />
            </div>
            <div className='range-datepicker__end'>
                <h3>Ngày kết thúc</h3>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    customInput={<CustomInput />}
                />
            </div>

        </div>
    );
}

export default RangeDatePicker