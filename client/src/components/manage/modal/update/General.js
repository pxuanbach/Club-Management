import React, {useRef, useState} from 'react'
import Avatar from '@mui/material/Avatar';
import './General.css'

const GeneralUpdate = () => {
    const inputAvatarImage = useRef(null);
    const [avatarImage, setAvatarImage] = useState(); 

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarImage(event.target.files[0]);
        }
    };

    return (
        <div className='general__body'>
            <div style={{flex: 0.3}}>
                <div className='modal-avatar'>
                    <input type="file" ref={inputAvatarImage} onChange={handleImageChange} />
                    <Avatar className='avatar'
                        onClick={() => { inputAvatarImage.current.click() }}
                        src={avatarImage ? URL.createObjectURL(avatarImage)
                            : ''}>
                        Ảnh đại diện
                    </Avatar>
                </div>
            </div>
            <div style={{flex: 0.7}}>

            </div>
        </div>
    )
}

export default GeneralUpdate