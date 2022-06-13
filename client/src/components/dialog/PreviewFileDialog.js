import React from 'react'
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle
} from '@mui/material';

const styleContainer = {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '300px',
    maxHeight: '300px',
    margin: '0px auto 5px',
    overflow: 'hidden',
}

const styleImg = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    objectPosition: "center",
}

const PreviewFileDialog = ({ 
    open, setOpen, title, file, resetFile, contentText, handleAgree 
}) => {

    const handleClose = () => {
        setOpen(false)
        resetFile()
    }

    const ConvertBoldText = (text) => {
        const newText = text.split('\b');
        for (let i = 0; i < newText.length; i++) {
            if (i % 2 !== 0) {
                newText[i] = <b>{newText[i]}</b>
            }
        }
        return newText;
    }

    const ConvertNewlineText = (text = '') => {
        const newText = text.split('\n').map((str, index) =>
            <p key={index}>{ConvertBoldText(str)}</p>
        );
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
                    {file?.type.includes('image') ?
                        (<div style={styleContainer}>
                            <img style={styleImg} src={URL.createObjectURL(file)}></img>
                        </div>) : (<></>)}
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

export default PreviewFileDialog