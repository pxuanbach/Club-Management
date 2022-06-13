import React, { useState } from 'react'
import { Avatar, Chip, Box } from '@mui/material'
import FilePresentIcon from '@mui/icons-material/FilePresent';
import './SelectedFiles.css';
import SeverityOptions from '../../../../helper/SeverityOptions';
import axiosInstance from '../../../../helper/Axios';
import CustomDialog from '../../../dialog/CustomDialog'

const SelectedFiles = ({
    cardId, files, setFiles, isLeader, showSnackbar, setIsLoading
}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentFile, setCurrentFile] = useState();

    const handleDeleteFile = () => {
        if (!isLeader) {
            showSnackbar("Bạn không đủ quyền để xóa.", SeverityOptions.warning)
            return;
        }
        setIsLoading(true);
        axiosInstance.patch(`/activity/card/deletefile/${cardId}`,
            JSON.stringify({
                "public_id": currentFile.public_id,
            }), {
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            setFiles(response.data.files)
            showSnackbar("Xóa tệp thành công", SeverityOptions.success)
        }).catch(err => {
            showSnackbar(err.response.data.error, SeverityOptions.error)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <Box>
            <CustomDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title="Xóa tệp"
                contentText={`Bạn có chắc muốn xóa tệp \b${currentFile ? currentFile.original_filename : ''}\b không?
                \nChúng tôi sẽ xóa toàn bộ các bản ghi liên quan đến tệp này!`}
                handleAgree={handleDeleteFile}
            />
            <h5 style={{ color: '#1B264D', }}>Tệp đính kèm</h5>
            <div className='selected-file__list'>
                {files.map((file, index) => (
                    <Chip className='selected-file__item' sx={{ maxWidth: '162px' }}
                        key={index}
                        avatar={<Avatar src={file.url}>
                            <FilePresentIcon sx={{ color: '#388E3C', backgroundColor: '#fff' }} />
                        </Avatar>}
                        label={<a href={file.url} target="_blank">
                            {file.original_filename}
                        </a>}
                        onDelete={(e) => {
                            e.preventDefault();
                            setCurrentFile(file);
                            setOpenDialog(true);
                        }}
                        clickable
                    />
                ))}
            </div>
        </Box>
    )
}

export default SelectedFiles