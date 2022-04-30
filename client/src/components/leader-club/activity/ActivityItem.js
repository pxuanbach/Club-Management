// import React, {useState} from 'react'
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Avatar from '@mui/material/Avatar';


// const options = [
//     'Ẩn',
//     'Xóa',
// ];
// const ITEM_HEIGHT = 48;

// const ActivityItem = () => {
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//       };
    
//       const handleClose = () => {
//         setAnchorEl(null);
//       };

//     return (
//         <div className='card-team'>
//             <div className='div-menu'>
//                 <IconButton
//                     aria-label="more"
//                     id="long-button"
//                     aria-controls={open ? 'long-menu' : undefined}
//                     aria-expanded={open ? 'true' : undefined}
//                     aria-haspopup="true"
//                     onClick={handleClick}
//                 >
//                     <MoreVertIcon className='icon-menu' />
//                 </IconButton>
//                 <Menu
//                     id="long-menu"
//                     MenuListProps={{
//                         'aria-labelledby': 'long-button',
//                     }}
//                     anchorEl={anchorEl}
//                     open={open}
//                     onClose={handleClose}
//                     PaperProps={{
//                         style: {
//                             maxHeight: ITEM_HEIGHT * 4.5,
//                             width: '15ch',
//                         },
//                     }}
//                 >
//                     {options.map((option) => (
//                         <MenuItem key={option} selected={option === 'Ẩn'} onClick={handleClose}>
//                             {option}
//                         </MenuItem>
//                     ))}
//                 </Menu>
//             </div>
//             <a style={{ textDecoration: 'none' }}>
//                 <div className='image-team'>
//                     <Avatar sx={{width: 110, height: 110}} />
//                 </div>
//                 <div className='name-team'>
//                     ABC
//                 </div>
//                 <div className='div-activity'></div>
//             </a>
//         </div>
//     )
// }

// export default ActivityItem
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import image1 from '../../../assets/anhminhhoa.jpg' 

export default function ActivityItem() {    
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardMedia
        component="img"
        height="120"
        image={image1}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Nội dung sự kiện 01/05
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mô tả sự kiện sắp tới
        </Typography>
      </CardContent>

    </Card>
  );
}