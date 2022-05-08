import Axios from 'axios'
import { upload_preset, cloudinary_API } from "./Helper"

const UploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'Club-Management/File')
    formData.append('upload_preset', upload_preset)

    let res = await Axios.post(cloudinary_API, formData);
    //console.log(res.data)
    return res.data;
}

const UploadFiles = async (files) => {
    const formData = new FormData()
    formData.append('file', files)
    formData.append('folder', 'Club-Management/File')
    formData.append('upload_preset', upload_preset)

    let res = await Axios.post(cloudinary_API, formData);
    //console.log(res.data)
    return res.data;
}


export {
    UploadFile,
    UploadFiles
}