const ENDPT = process.env.REACT_APP_SOCKET_ENDPT || 'localhost:5000'
const cloudinary_API = `https://api.cloudinary.com/v1_1/ddpmmci58/image/upload`
const upload_preset = 'euq5n0ei'

export {
    ENDPT,
    upload_preset,
    cloudinary_API,
}