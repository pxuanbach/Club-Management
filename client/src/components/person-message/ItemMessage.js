import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import './ItemMessage.css'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar } from '@mui/material';

const options = [
    'Xóa',
];
const ITEM_HEIGHT = 48;

const ItemMessage = ({ room, setCurrentRoom }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div className="item-message"
            onClick={() => {
                setCurrentRoom(room)
            }}>
            <Avatar src={room.imgUrl} sx={{ width: 58, height: 58 }} />
            <div className="content-message">
                <div className='content'>
                    <h3>{room.name}</h3>
                    <p className="latest-message">{room.lastMessage}</p>
                </div>
                <div className='div-menu-item-mess'>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon className='icon-menu' />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '15ch',
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} selected={option === 'Ẩn'} onClick={handleClose}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default ItemMessage;