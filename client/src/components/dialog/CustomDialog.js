import React from 'react'
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle
} from '@mui/material';

const CustomDialog = ({ open, setOpen, title, contentText, handleAgree }) => {

    const handleClose = () => {
        setOpen(false)
    }

    const ConvertBoldText = (text) => {
        const newText = text.split('\b');
        for(let i = 0; i < newText.length; i++) {
            if (i%2 !== 0) {
                newText[i] = <b>{newText[i]}</b>
            }
        }
        return newText;
    }

    const ConvertNewlineText = (text) => {
        const newText = text.split('\n').map(str => <p>{ConvertBoldText(str)}</p>);
        return newText;
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
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {ConvertNewlineText(contentText)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3, paddingTop: 0 }}>
                    <Button variant='contained'
                        onClick={() => {
                            handleAgree()
                            handleClose()
                        }}
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

export default CustomDialog