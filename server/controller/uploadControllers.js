const cloudinary = require('../helper/Cloudinary')
const fs = require('fs')

async function uploadFile(files, public_id) {
    if (files.length > 0) {
        const { path } = files[0]

        const newPath = await cloudinary.uploader.upload(path, {
            resource_type: 'auto',
            folder: 'Club-Management/Messages'
        }).catch(error => {
            console.log(error)
            return {
                original_filename: '',
                url: '',
                public_id: '',
            }
        })
        fs.unlinkSync(path)
        if (public_id !== '') {
            await cloudinary.uploader.destroy(public_id, function (result) {
                console.log("destroy file", result);
            }).catch(err => {
                console.log("destroy file err ", err.message)
            })
        }
        //console.log("upload function", newPath)
        return {
            original_filename: newPath.original_filename,
            url: newPath.url,
            public_id: newPath.public_id
        }
    }
    return {
        original_filename: '',
        url: '',
        public_id: '',
    }
}

module.exports.upload = async (req, res) => {
    const files = req.files

    const uploadData = await uploadFile(files, '');

    if (uploadData.original_filename === '') {
        res.status(400).send({error: "Đăng tải tệp không thành công!"});
    } else {
        res.status(200).send(uploadData);
    }
}