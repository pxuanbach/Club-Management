import React, { useState, useEffect, useRef } from 'react'
import "./AddClub.css"
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import io from 'socket.io-client';
import { UploadImageClub } from '../../../helper/UploadImage';
import { ENDPT } from '../../../helper/Helper'

let socket;

const AddClub = ({ setShowFormAdd }) => {
    const avatarRef = useRef();
    const inputAvatarImage = useRef(null);
    const [avatarHeight, setAvatarHeight] = useState(150);
    const [avatarImage, setAvatarImage] = useState();
    const [values, setValues] = useState({
        name: '',
        description: '',
    });
    const [openAutoComplete, setOpenAutoComplete] = useState(false)
    const [users, setUsers] = useState([])
    const [leaderSelected, setLeaderSelected] = useState()

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
            socket.emit('create-club', values.name, img_url, values.description, leaderSelected._id, onExitClick)
        }
    }

    const handleSearchMembers = event => {
        event.preventDefault();
        socket.emit('search-user', event.target.value)
    }

    const onExitClick = () => {
        setShowFormAdd(false);
    };

    useEffect(() => {
        socket = io(ENDPT);
        //socket.emit('join', { username: values.username, password: values.password})
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPT])

    useEffect(() => {
        setAvatarHeight(avatarRef ? avatarRef?.current?.offsetWidth : 150)
    }, [avatarRef])

    useEffect(() => {
        socket.on('output-search-user', result => {
            setUsers(result)
            //console.log(result)
        })
    }, [users])

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
                            <Avatar className='avatar' ref={avatarRef}
                                sx={{ height: avatarHeight }}
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
                    <Autocomplete id='search-members'
                        fullWidth
                        open={openAutoComplete}
                        onOpen={() => {
                            setOpenAutoComplete(true);
                        }}
                        onClose={() => {
                            setOpenAutoComplete(false);
                        }}
                        onChange={(event, value) => setLeaderSelected(value)}
                        options={users}
                        getOptionLabel={(option) => option.username}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                onChange={handleSearchMembers}
                                id="add-members"
                                variant="outlined"
                                label="Trưởng câu lạc bộ"
                                size="small"
                            />
                        )} />
                </div>
                <div>
                    {leaderSelected && <div className='user-selected'>
                            <Avatar src={leaderSelected.img_url}/>
                            <div className='selected-info'>
                                <span>{leaderSelected.name}</span>
                                <span>{leaderSelected.email}</span>
                            </div>
                        </div>}
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