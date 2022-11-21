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
import moment from 'moment';
import './ActivityItem.css'
import axiosInstance from '../../../helper/Axios';

const ITEM_HEIGHT = 48;

export default function ActivityItem({
  activity, link, setShowFormUpdate, setOpenDialog,
  setActivitySelected, setShowCollaborators,
  handleExportActivity, isLeader, handleSumary
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentDate = moment()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 270, position: 'relative' }}>
      {isLeader && <div className='activity-item-menu'>
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
          <MenuItem onClick={() => {
            handleExportActivity(activity)
            handleClose()
          }}>
            Báo cáo
          </MenuItem>
          <MenuItem
            disabled={currentDate < moment(activity.endDate) || activity.sumary !== ""}
            onClick={async () => {await handleSumary(activity)}}
          >
            Tổng kết
          </MenuItem>
        </Menu>
      </div>}
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
            {moment(activity.startDate).format("DD/MM/YYYY HH:mm")} - {moment(activity.endDate).format("DD/MM/YYYY HH:mm")}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
}