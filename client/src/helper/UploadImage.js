import Axios from 'axios'
import { upload_preset, cloudinary_API } from "./Helper"

const UploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'Club-Management/Club-Avatar')
    formData.append('upload_preset', upload_preset)

    let res = await Axios.post(cloudinary_API, formData);

    return res.data.secure_url;
}

export default UploadImage