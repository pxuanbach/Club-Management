import React from 'react'
import { Button, Avatar, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const MemberItem = ({ user, isMember = false }) => {
    return (
        <div className='members__item'>
            <Avatar alt={user?.name} src={user?.img_url} sizes='small' />
            <span>{user?.name}</span>
            <span>{user?.email}</span>
            <div>
                {!isMember ? null : (
                    <>
                        <Tooltip title="Đuổi khỏi câu lạc bộ" placement="right-start">
                            <Button
                                sx={{ color: '#1B264D'}}
                                disableElevation
                            >
                                <ClearIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Làm trưởng câu lạc bộ" placement="right-start">
                            <Button
                                sx={{ color: '#1B264D' }}
                                disableElevation
                            >
                                <KeyboardDoubleArrowUpIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Làm thủ quỹ" placement="right-start">
                            <Button
                                sx={{ color: '#1B264D' }}
                                disableElevation
                            >
                                <CurrencyExchangeIcon />
                            </Button>
                        </Tooltip>
                    </>)
                }
            </div>
        </div>
    )
}

export default MemberItem