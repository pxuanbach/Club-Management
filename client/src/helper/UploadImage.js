import Axios from 'axios'
import { upload_preset, cloudinary_API } from "./Helper"

const UploadImageClub = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'Club-Management/Club-Avatar')
    formData.append('upload_preset', upload_preset)

    let res = await Axios.post(cloudinary_API, formData);
    //console.log(res.data)
    return res.data;
}

const UploadImageUser = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'Club-Management/User-Avatar')
    formData.append('upload_preset', upload_preset)

    let res = await Axios.post(cloudinary_API, formData);

    return res.data;
}

export {
    UploadImageClub,
    UploadImageUser
}