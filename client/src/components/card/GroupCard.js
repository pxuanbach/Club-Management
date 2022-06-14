import React from 'react'
import {
    Card, CardHeader, CardContent, CardActions,
    Box, Avatar, IconButton, Divider, Tooltip,
    AvatarGroup
} from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const GroupCard = ({ group, isLeader, handleGroupExit }) => {

    return (
        <Box>
            <Card sx={{ width: '270px' }}>
                <CardHeader className='card__header'
                    avatar={<Avatar>{group.name.charAt(0)}</Avatar>}
                    title={group.name}
                />
                <Divider />
                <CardContent>
                    <h4>Thành viên</h4>
                    <div style={{ display: 'flex', padding: '2px' }}>
                        <AvatarGroup
                            total={group.members.length}>
                            {group.members.map((user, index) => (
                                <Tooltip title={user.name} key={index}>
                                    <Avatar key={user._id}
                                        alt={user.name}
                                        src={user.img_url}
                                    />
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    </div>

                </CardContent>
                <Divider />
                <CardActions>
                    {isLeader &&
                        <Tooltip title="Xóa khỏi thẻ">
                            <IconButton onClick={handleGroupExit}>
                                <HighlightOffIcon sx={{ color: '#1B264D' }} />
                            </IconButton>
                        </Tooltip>}
                </CardActions>
            </Card>
        </Box>
    )
}

export default GroupCard