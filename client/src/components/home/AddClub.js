import React, { useState, useEffect, useRef } from 'react'
import "./AddClub.css"
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import io from 'socket.io-client';
import { UploadImageClub } from '../../helper/UploadImage';
import { ENDPT } from '../../helper/Helper'

let socket;

const AddClub = ({ setShowFormAddClub }) => {
    const inputAvatarImage = useRef(null);
    const [avatarImage, setAvatarImage] = useState();
    const [values, setValues] = useState({
        name: '',
        description: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarImage(event.target.files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(values)
        if (values.name) {
            let img_url = await UploadImageClub(avatarImage);
            socket.emit('create-club', values.name, img_url, values.description, onExitClick)
        }
    }

    const onExitClick = () => {
        setShowFormAddClub(false);
    };

    useEffect(() => {
        socket = io(ENDPT);
        //socket.emit('join', { username: values.username, password: values.password})
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPT])

    return (
        <div className='div-add'>
            <div className='div-info'>
                <div className='title'>
                    Tạo câu lạc bộ mới
                    <p>Cộng tác chặt chẽ với một nhóm người trong tổ chức của bạn dựa trên dự án, sáng kiến hoặc lợi ích chung.</p>
                </div>
                <div className='info'>
                    <div className='div-left'>
                        <div className='modal-avatar'>
                            <input type="file" ref={inputAvatarImage} onChange={handleImageChange} />
                            <Avatar className='avatar'
                                sx={{ width: 150, height: 150 }}
                                onClick={() => { inputAvatarImage.current.click() }}
                                src={avatarImage ? URL.createObjectURL(avatarImage)
                                    : ''}>
                                Ảnh đại diện
                            </Avatar>
                        </div>
                    </div>
                    <div className='div-right'>
                        <div className='div-team-name'>
                            <TextField id="club-name"
                                value={values.name}
                                onChange={handleChange('name')}
                                label="Tên câu lạc bộ"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                size="small" />
                        </div>
                        <div className='div-description'>
                            <TextField id="club-description"
                                value={values.description}
                                onChange={handleChange('description')}
                                label="Mô tả câu lạc bộ"
                                variant="outlined"
                                multiline
                                rows={4}
                                margin="dense"
                                fullWidth
                                size="small" />
                        </div>
                    </div>
                </div>
                <div className='div-team-search'>
                    <TextField
                        id="add-members"
                        variant="outlined"
                        label="Thêm thành viên"
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton style={{ color: '#1B264D' }}>
                                        <PersonAddIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className='display-members'>
                    <AvatarGroup className='avatagroup'>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                    </AvatarGroup>
                </div>
            </div>
            <div className="div-todo">
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disableElevation>
                    Lưu
                </Button>
                <Button
                    onClick={onExitClick}
                    variant="outlined"
                    disableElevation>
                    Hủy
                </Button>
            </div>
        </div>
    )
}

export default AddClub