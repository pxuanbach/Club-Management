import React from 'react'
import {
    Button, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle
} from '@mui/material';
import axiosInstance from '../../../../helper/Axios'

const DeleteActivity = ({ open, setOpen, activity, activityDeleted, showSnackbar }) => {

    const handleClose = () => {
        setOpen(false)
    }

    const handleAgree = async (e) => {
        e.preventDefault();
        axiosInstance.delete(`/activity/delete/${activity._id}`)
        .then(response => {
            //response.data
            activityDeleted(response.data)
            handleClose();
          }).catch(err => {
            //err.response.data.error
            showSnackbar(err.response.data.error)
          })
        
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
                    {"Xóa hoạt động?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc muốn xóa hoạt động <b>{activity ? activity.content : ''}</b> không? <br></br>
                        Chúng tôi sẽ xóa toàn bộ các bản ghi liên quan đến hoạt động này!
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

export default DeleteActivity