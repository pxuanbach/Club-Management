import React from 'react'
import { Avatar, Chip, Stack, Box } from '@mui/material'
import FilePresentIcon from '@mui/icons-material/FilePresent';
import './SelectedFiles.css'

const SelectedFiles = ({ files }) => {

    return (
        <Box>
            <h5>Tệp đính kèm</h5>
            <div className='selected-file__list'>
                {files.map((file, index) => (
                    <a key={index}
                        className="selected-file__item"
                        href={file.url}
                        target="_blank">
                        <Chip className='selected-file__item'
                            avatar={<Avatar src={file.url}>
                                <FilePresentIcon sx={{ color: '#388E3C', backgroundColor: '#fff'}} />
                            </Avatar>}
                            label={file.original_filename}
                        />
                    </a>

                ))}
            </div>
        </Box>
    )
}

export default SelectedFiles