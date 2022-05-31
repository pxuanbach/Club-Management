import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import image1 from '../../../assets/anhminhhoa.jpg';
import { Link } from 'react-router-dom'
import './ActivityItem.css'

const ITEM_HEIGHT = 48;

export default function ActivityItem({
  activity, link, setShowFormUpdate, setOpenDialog, 
  setActivitySelected, setShowCollaborators
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  let formatter = new Intl.DateTimeFormat(['ban', 'id'], {
    year: "numeric", month: "numeric", day: "numeric",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 250, position: 'relative' }}>
      <div className='activity-item-menu'>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon className='icon-menu' sx={{ color: 'white' }} />
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
              width: 'max-content',
            },
          }}
        >
          <MenuItem onClick={() => {
            setActivitySelected(activity)
            handleClose()
            setShowCollaborators(true)
          }}>
            Cộng tác viên
          </MenuItem>
          <MenuItem onClick={() => {
            setActivitySelected(activity)
            handleClose()
            setShowFormUpdate(true)
          }}>
            Cập nhật
          </MenuItem>
          <MenuItem onClick={() => {
            setActivitySelected(activity)
            handleClose()
            setOpenDialog(true)
          }}>
            Xóa
          </MenuItem>
        </Menu>
      </div>
      <CardMedia
        component="img"
        height="120"
        image={image1}
        alt="green iguana"
      />
      <Link style={{ textDecoration: 'none' }} to={link}>
        <CardContent>
          <Typography className='activity-item-title' gutterBottom variant="h5" component="div">
            {activity.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatter.format(Date.parse(activity.startDate))} - {formatter.format(Date.parse(activity.endDate))}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
}