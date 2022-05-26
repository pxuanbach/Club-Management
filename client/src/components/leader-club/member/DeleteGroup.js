import React from 'react'
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import axiosInstance from '../../../helper/Axios'

const DeleteGroup = ({ open, setOpen, group, groups, setGroups }) => {
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleAgree = async (e) => {
        e.preventDefault();
        const res = await axiosInstance.delete(`/group/delete/${group._id}`)

        const data = res.data
        if (data) {
            setGroups(groups.filter(group => group._id !== data))
            handleClose()
        }
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xóa câu lạc bộ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc muốn xóa nhóm <b>{group ? group.name : ''}</b> không? <br></br>
                        Chúng tôi sẽ xóa toàn bộ các bản ghi liên quan đến nhóm này!
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3, paddingTop: 0 }}>
                    <Button variant='contained'
                        onClick={handleAgree}
                        disableElevation
                        autoFocus
                    >
                        Đồng ý
                    </Button>
                    <Button variant='outlined'
                        onClick={handleClose}
                        disableElevation
                    >
                        Hủy bỏ
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DeleteGroup