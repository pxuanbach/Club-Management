import React from 'react'
import {
    Card, CardHeader, CardContent, CardActions,
    Box, Avatar, IconButton, Divider, Tooltip
} from '@mui/material'

const FindGroupCard = () => {
    return (
        <Box>
            <Card>
                <CardHeader
                    title={"Nhóm"}
                />
                <Divider />
                <CardContent>
                    <div className='div-search-memberassign'>
                        <input
                            type="text"
                            placeholder="Tìm nhóm"
                        />
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </CardContent>
            </Card>
        </Box>
    )
}

export default FindGroupCard