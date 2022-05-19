import React from 'react'
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import axiosInstance from '../../../helper/Axios'
import {Buffer} from 'buffer'

const DeleteClub = ({ open, setOpen, club, clubs, setClubs }) => {

    const handleClose = () => {
        setOpen(false)
    }

    const handleAgree = async (e) => {
        e.preventDefault();
        const encodedCloudId = new Buffer(club.cloudinary_id).toString('base64');

        const res = await axiosInstance.delete(`/club/delete/${club._id}/${encodedCloudId}`)

        const data = res.data
        if (data) {
            var deleteClubs = clubs.filter(function (value, index, arr) {
                return value._id !== data._id;
            })
        
            setClubs(deleteClubs)
            handleClose();
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
                        Bạn có chắc muốn xóa câu lạc bộ <b>{club ? club.name : ''}</b> không? <br></br>
                        Chúng tôi sẽ xóa toàn bộ các bản ghi liên quan đến câu lạc bộ này!
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

export default DeleteClub