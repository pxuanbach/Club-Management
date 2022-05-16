import React, { useRef, useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './General.css'
import { UploadImageClub } from '../../../../helper/UploadImage'

const GeneralUpdate = ({ setShowFormUpdate, club, socket }) => {
    const avatarRef = useRef();
    const inputAvatarImage = useRef(null);
    const [avatarHeight, setAvatarHeight] = useState();
    const [avatarImage, setAvatarImage] = useState();
    const [values, setValues] = useState({
        name: club.name,
        description: club.description,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarImage(event.target.files[0]);
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);
        let img_upload_data;
        if (avatarImage) {
            img_upload_data = await UploadImageClub(avatarImage);
        }
        console.log(img_upload_data)
        //console.log('values', values)
        socket.emit('update-club-info', 
            club._id, 
            values.name, 
            values.description, 
            img_upload_data?.secure_url, 
            img_upload_data?.public_id,
            club.cloudinary_id, //cur_cloud_id
            () => setIsLoading(false)) 
    }

    useEffect(() => {
        setAvatarHeight(avatarRef ? avatarRef?.current?.offsetWidth : 150)
    }, [])

    return (
        <div className='general__body'>
            <div style={{ flex: 0.3 }}>
                <div className='modal-avatar'>
                    <input type="file" ref={inputAvatarImage} onChange={handleImageChange} />
                    <Avatar className='avatar' ref={avatarRef}
                        sx={{ height: avatarHeight }}
                        onClick={() => { inputAvatarImage.current.click() }}
                        src={avatarImage ? URL.createObjectURL(avatarImage)
                            : club.img_url}>
                        Ảnh đại diện
                    </Avatar>
                </div>
            </div>
            <div style={{ flex: 0.7 }}>
                <div className='div-team-name'>
                    <TextField id="club-name"
                        value={values.name}
                        onChange={handleChange('name')}
                        label="Tên câu lạc bộ"
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        size="small"
                    />
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
                        size="small"
                    />
                </div>
                <div style={{padding: 10}}></div>
                <div className="div-todo">
                    <Button disabled={isLoading}
                        onClick={handleSubmit}
                        variant="contained"
                        disableElevation>
                        Lưu
                    </Button>
                    <Button disabled={isLoading}
                        onClick={() => setShowFormUpdate(false)}
                        variant="outlined"
                        disableElevation>
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default GeneralUpdate