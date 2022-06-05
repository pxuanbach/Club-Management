import React from 'react'
import {
    Card, CardHeader, CardContent, CardActions,
    Box, Avatar, IconButton, Divider, Tooltip
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook';
import SendIcon from '@mui/icons-material/Send';
import './UserCard.css'

const UserCard = ({ user }) => {
    const handleOpenFacebook = () => {
        window.open(user.facebook, "_blank")
    }

    return (
        <Box>
            <Card>
                <CardHeader className='card__header'
                    avatar={<Avatar src={user.img_url} />}
                    title={user.name}
                    subheader={user.email}
                />
                <Divider />
                <CardContent>
                    <span>{user.description}</span>
                </CardContent>
                <Divider />
                <CardActions>
                    <Tooltip title="Facebook">
                        <IconButton onClick={handleOpenFacebook}>
                            <FacebookIcon sx={{ color: '#1B264D' }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Trò chuyện">
                        <IconButton>
                            <SendIcon sx={{ color: '#1B264D' }} />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
        </Box>
    )
}

export default UserCard