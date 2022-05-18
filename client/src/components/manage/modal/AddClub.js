import React, { useState, useEffect, useRef } from 'react'
import "./AddClub.css"
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axiosInstance from '../../../helper/Axios'
import io from 'socket.io-client';
import FindMember from './FindMember'
import { UploadImageClub } from '../../../helper/UploadImage';
import { ENDPT } from '../../../helper/Helper'

let socket;

const AddClub = ({ setShowFormAdd, clubs, setClubs }) => {
    const avatarRef = useRef();
    const inputAvatarImage = useRef(null);
    const [avatarHeight, setAvatarHeight] = useState(150);
    const [avatarImage, setAvatarImage] = useState();
    const [values, setValues] = useState({
        name: '',
        description: '',
    });
    const [nameErr, setNameErr] = useState('');
    const [leaderSelected, setLeaderSelected] = useState();
    const [leaderErr, setLeaderErr] = useState('');
    const [treasurerSelected, setTreasurerSelected] = useState();
    const [treasurerErr, setTreasurerErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

    const handleImageChange = (event) => {
        if (isFileImage(event.target.files[0])) {
            setAvatarImage(event.target.files[0]);
        } else {
            alert('Ảnh đại diện nên là tệp có đuôi .jpg, .png, .bmp,...')
        }
    };

    const validateSubmit = () => {
        let isError = false;
        setNameErr('')
        setIsLoading(true);

        if (!values.name) {
            setNameErr('Tên câu lạc bộ đang trống')
            isError = true;
        }

        if (!leaderSelected) {
            setLeaderErr('Chưa chọn trưởng câu lạc bộ')
            isError = true;
        }

        if (!treasurerSelected) {
            setTreasurerErr('Chưa chọn thủ quỹ')
            isError = true;
        }

        return isError;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateSubmit()) {
            setIsLoading(false);
            return;
        }

        //send request to server
        let img_upload_data = {};
        if (avatarImage) {
            img_upload_data = await UploadImageClub(avatarImage)
                .catch(err => console.log(err));;
        }
        
        const res = await axiosInstance.post('/club/create', JSON.stringify({
            'name': values.name,
            'img_url': img_upload_data.secure_url,
            'cloudinary_id': img_upload_data.public_id,
            'description': values.description,
            'leader': leaderSelected._id,
            'treasurer': treasurerSelected._id
        }), {
            headers: { 'Content-Type': 'application/json' }
        })

        const data = res.data
        
        if (data) {
            setClubs([...clubs, data])
            resetState();
        }
        // socket.emit('create-club',
        //     values.name,
        //     img_upload_data.secure_url,
        //     img_upload_data.public_id,
        //     values.description,
        //     leaderSelected,
        //     treasurerSelected,
        //     resetState)
    }

    const resetState = () => {
        setValues({
            name: '',
            description: '',
        })
        setAvatarImage(null)
        setLeaderSelected(null)
        setTreasurerSelected(null)
        setIsLoading(false)
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
                                error={nameErr}
                                helperText={nameErr}
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
                <div className='div-search-member'>
                    <FindMember title='Trưởng câu lạc bộ'
                        errorText={leaderErr}
                        setErrorText={setLeaderErr}
                        memberSelected={leaderSelected}
                        setMemberSelected={setLeaderSelected}
                    />
                    <FindMember title='Thủ quỹ'
                        errorText={treasurerErr}
                        setErrorText={setTreasurerErr}
                        memberSelected={treasurerSelected}
                        setMemberSelected={setTreasurerSelected}
                    />
                </div>


            </div>
            <div className="div-todo">
                <Button disabled={isLoading}
                    onClick={handleSubmit}
                    variant="contained"
                    disableElevation>
                    Lưu
                </Button>
                <Button disabled={isLoading}
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