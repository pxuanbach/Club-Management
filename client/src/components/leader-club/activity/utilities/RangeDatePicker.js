import React, { useState, forwardRef } from 'react'
import { Button } from '@mui/material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './RangeDatePicker.css'

const RangeDatePicker = ({
    startDateTitle, endDateTitle, 
    startDate, endDate, 
    setStartDate, setEndDate,
    textCenter
}) => {

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
                <h3>{startDateTitle}</h3>
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
            <h2>{textCenter}</h2>
            <div className='range-datepicker__end'>
                <h3>{endDateTitle}</h3>
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