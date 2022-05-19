import React, { useRef, useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './General.css'
import { UploadImageClub } from '../../../../helper/UploadImage'
import axiosInstance from '../../../../helper/Axios';

const GeneralUpdate = ({ setShowFormUpdate, club, clubs, setClubs }) => {
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
        //console.log(img_upload_data)
        //console.log('values', values)
        const res = await axiosInstance.patch(`/club/update/${club._id}`,
            JSON.stringify({
                "name": values.name,
                "description": values.description,
                "new_img_url": img_upload_data?.secure_url,
                "new_cloud_id": img_upload_data?.public_id,
                "cur_cloud_id": club.cloudinary_id,
            }), {
                headers: { 'Content-Type': 'application/json' }
            }
        )

        const data = res.data;
        console.log(data)

        if (data) {
            const updateClubs = clubs.map((elm) => {
                if (elm._id === data._id) {
                return {
                    ...elm,
                    name: data.name,
                    description: data.description,
                    img_url: data.img_url,
                    cloudinary_id: data.cloudinary_id,
                }
                }
                return elm;
            });
            setClubs(updateClubs)

            setIsLoading(false)
        }
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
                <div style={{ padding: 10 }}></div>
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