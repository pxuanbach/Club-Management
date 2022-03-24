import React, { useState, useEffect, useRef } from 'react'
import "./AddClub.css"
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Axios from 'axios'
import io from 'socket.io-client';
import {ENDPT, upload_preset, cloudinary_API} from '../../Helper'

let socket;

const AddClub = ({ setShowFormAddClub }) => {
    const ENDPT = 'localhost:5000'
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

        const formData = new FormData()
        formData.append('file', avatarImage)
        formData.append('folder', 'Club-Management/Club-Avatar')
        formData.append('upload_preset', upload_preset)

        Axios.post(cloudinary_API, formData)
        .then((res) => {
            console.log(res.data.secure_url)
            if (values.name) {
                socket.emit('create-club', values.name, res.data.secure_url, values.description, onExitClick)
            }
        })
        .catch((err) => {
            console.log(err)
        })
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
                            <label className='label'>Tên câu lạc bộ</label>
                            <input className='input-name'
                                value={values.name}
                                onChange={handleChange('name')}></input>
                        </div>
                        <div className='div-description'>
                            <label className='label'>Mô tả</label>
                            <textarea className='desciption'
                                cols="100" rows="4"
                                placeholder="Vui lòng nhập tại đây..."
                                value={values.description}
                                onChange={handleChange('description')}></textarea>
                        </div>
                    </div>
                </div>
                <div className='div-team-search'>
                    <label className='label-search'>Thêm thành viên</label>
                    <i class="fa-solid fa-user-plus"></i>
                    <input className='input-search' placeholder="Nhập tên thành viên..."></input>
                    <AvatarGroup className='avatagroup' total={24}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                    </AvatarGroup>
                </div>
            </div>
            <div className="div-todo">
                <button onClick={onExitClick} className='btn-exit'>
                    Cancel
                </button>
                <button onClick={handleSubmit} className='btn-next'>
                    Next
                </button>
            </div>
        </div>
    )
}

export default AddClub