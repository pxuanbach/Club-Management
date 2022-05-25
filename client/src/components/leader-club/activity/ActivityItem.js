import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import image1 from '../../../assets/anhminhhoa.jpg' 

export default function ActivityItem({activity}) {    
  let formatter = new Intl.DateTimeFormat(['ban', 'id'], {
    hour: 'numeric', minute: 'numeric',
    year: "numeric", month: "numeric", day: "numeric",  
  });

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
          {activity.content}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatter.format(Date.parse(activity.startDate))} - {formatter.format(Date.parse(activity.endDate))}
        </Typography>
      </CardContent>

    </Card>
  );
}