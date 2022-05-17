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