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
    const isClubRoom = room.room_id.split('_').length <= 1

    const handleClick = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClose = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setAnchorEl(null);
    };

    const handleDeleteMessages = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        //room.room_id
        handleClose();
    }

    const handleSelectRoom = (e) => {
        e.preventDefault();
        setCurrentRoom(JSON.parse(JSON.stringify(room)))
        console.log(room)
    }

    return (
        <div className="item-message" onClick={handleSelectRoom}>
            <Avatar
                src={room.imgUrl}
                sx={{ width: 58, height: 58 }}
            />
            <div className="content-message">
                <div className='content'>
                    <h3>{room.name}</h3>
                    <p className="latest-message">{room.lastMessage}</p>
                </div>
                {isClubRoom ? <></> :
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
                        <MenuItem onClick={handleDeleteMessages}>
                            Xóa
                        </MenuItem>
                    </Menu>
                </div>}
            </div>
        </div>
    )
}

export default ItemMessage;