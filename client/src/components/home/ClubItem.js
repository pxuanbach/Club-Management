import React, {useState} from 'react'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import "./Home.css";

const options = [
    'Ẩn',
    'Xóa',
];
const ITEM_HEIGHT = 48;

const ClubItem = ({club}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    return (
        <div className='card-team'>
            <div className='div-menu'>
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
            <a href='/club' style={{ textDecoration: 'none' }}>
                <div className='image-team'>
                    <Avatar sx={{width: 110, height: 110}} src={club.img_url}/>
                </div>
                <div className='name-team'>
                    {club.name}
                </div>
                <div className='div-activity'></div>
            </a>
        </div>
    )
}

export default ClubItem