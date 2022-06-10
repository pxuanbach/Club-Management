import React from 'react'
import { Avatar, Chip, Box } from '@mui/material'
import FilePresentIcon from '@mui/icons-material/FilePresent';
import './SelectedFiles.css'

const SelectedFiles = ({ files, isLeader, showSnackbar }) => {
    const handleDeleteFile = (e) => {
        e.preventDefault();
        if (!isLeader) {
            showSnackbar("Bạn không đủ quyền để xóa.", false)
            return;
        }
    }

    return (
        <Box>
            <h5 style={{ color: '#1B264D', }}>Tệp đính kèm</h5>
            <div className='selected-file__list'>
                {files.map((file, index) => (
                    <Chip className='selected-file__item' sx={{ maxWidth: '160px' }}
                        key={index}
                        avatar={<Avatar src={file.url}>
                            <FilePresentIcon sx={{ color: '#388E3C', backgroundColor: '#fff' }} />
                        </Avatar>}
                        label={<a href={file.url} target="_blank">
                            {file.original_filename}
                        </a>}
                        onDelete={handleDeleteFile}
                        clickable
                    />
                ))}
            </div>
        </Box>
    )
}

export default SelectedFiles