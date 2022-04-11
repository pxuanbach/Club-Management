import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteClub = ({ open, setOpen, club, socket }) => {
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleAgree = () => {
        socket.emit('delete-club', club._id, club.cloudinary_id, handleClose)
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