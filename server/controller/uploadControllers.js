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
        }).catch(error => {
            console.log(error)
            res.status(400).json({
                error
            })
        })


        urls.push(newPath)


        fs.unlinkSync(path)
    }

    if (urls.length > 0) {
        res.status(200).json({
            message: 'Upload success',
            data: urls
        });
    }
    console.log('sended')
    res.send();
}