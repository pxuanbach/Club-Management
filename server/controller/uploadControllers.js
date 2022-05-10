const cloudinary = require('../helper/Cloudinary')
const fs = require('fs')

module.exports.upload = async (req, res) => {
    const files = req.files
    let urls = []

    for (const file of files) {
        const { path } = file

        const newPath = await cloudinary.uploader.upload(path, {
            resource_type: 'auto',
            folder: 'Club-Management/Files'
        })
        
        urls.push({
            url: newPath.url,
            public_id: newPath.public_id,
        })
        fs.unlinkSync(path)
    }

    res.status(200).json({
        message: 'Upload success',
        data: urls
    });
}