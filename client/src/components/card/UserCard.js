import React from 'react'
import {
    Card, CardHeader, CardContent, CardActions,
    Box, Avatar, IconButton, Divider, Tooltip
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook';
import SendIcon from '@mui/icons-material/Send';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './UserCard.css'

const UserCard = ({ user, isLeader, handleUserExit }) => {
    const handleOpenFacebook = () => {
        window.open(user.facebook, "_blank")
    }

    return (
        <Box>
            <Card sx={{ width: '300px' }}>
                <CardHeader className='card__header'
                    avatar={<Avatar src={user.img_url} />}
                    title={user.name}
                    subheader={user.email}
                />
                <Divider />
                <CardContent>
                    <span>Giới tính: {user.gender}</span>
                    <br></br>
                    <span>Số điện thoại: {user.phone}</span>
                    <br></br>
                    <span>{user.description}</span>
                </CardContent>
                <Divider />
                <CardActions>
                    <Tooltip title="Facebook">
                        <IconButton onClick={handleOpenFacebook}>
                            <FacebookIcon sx={{ color: '#1B264D' }} />
                        </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Trò chuyện">
                        <IconButton>
                            <SendIcon sx={{ color: '#1B264D' }} />
                        </IconButton>
                    </Tooltip> */}
                    {isLeader &&
                        <Tooltip title="Xóa khỏi thẻ">
                            <IconButton onClick={handleUserExit}>
                                <HighlightOffIcon sx={{ color: '#1B264D' }} />
                            </IconButton>
                        </Tooltip>}
                </CardActions>
            </Card>
        </Box>
    )
}

export default UserCard