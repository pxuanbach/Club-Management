const xlsx = require('xlsx')
const fs = require('fs')
const Club = require('../models/Club')
const User = require('../models/User')
const Activity = require('../models/Activity')
const ActivityCard = require('../models/ActivityCard')

const convertClubsToExport = (clubs) => {
    let dataArr = []

    clubs.forEach(club => {
        const data = {
            "Mã": club._id.toString(),
            "Tên": club.name,
            "Mô tả": club.description,
            "Quỹ": club.fund,
            "Trưởng câu lạc bộ": club.leader.name,
            "Email trưởng câu lạc bộ": club.leader.email,
            "Thủ quỹ": club.treasurer.name,
            "Email thủ quỹ": club.treasurer.email,
            "Thành viên": club.members.length + 2
        }
        //console.log(data)
        dataArr.push(data)
    })

    return dataArr;
}

const convertUsersToExport = (users) => {
    let dataArr = []

    users.forEach(user => {
        const data = {
            "Mã": user._id.toString(),
            "Mã sinh viên": user.username,
            "Tên": user.name,
            "Giới tính": user.gender,
            "Mô tả": user.description,
            "Email": user.email,
            "Số điện thoại": user.phone,
            "Facebook": user.facebook
        }
        //console.log(data)
        dataArr.push(data)
    })

    return dataArr;
}

const converActivityToExport = (activity) => {
    return [
        {
            "Mã": activity._id.toString(),
            "Tên hoạt động": activity.title,
            "Tạo ngày": activity.createdAt,
            "Ngày bắt đầu": activity.startDate,
            "Ngày kết thúc": activity.endDate,
            "Mã câu lạc bộ": activity.club._id.toString(),
            "Câu lạc bộ": activity.club.name,
        }
    ]
}


module.exports.exportClubs = async (req, res) => {
    const excelOutput = Date.now() + "clubs.xlsx";
    const clubs = await Club.find({}).populate('leader').populate('treasurer').lean();

    var clubWS = xlsx.utils.json_to_sheet(convertClubsToExport(clubs));
    var wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, clubWS, "Câu lạc bộ");

    var excelBinary = xlsx.write(wb, { bookType: 'xlsx', type: 'binary' })

    fs.writeFileSync(excelOutput, excelBinary, 'binary')

    res.download(excelOutput, (err) => {
        if (err) {
            fs.unlinkSync(excelOutput);
            res.status(400).send({ error: "Không thể tải tệp excel" })
        }
        fs.unlinkSync(excelOutput);
    })
}

module.exports.exportUsers = async (req, res) => {
    const excelOutput = Date.now() + "users.xlsx";
    const users = await User.find({ username: { $nin: ['admin', 'admin0'] } }).lean();

    var userWS = xlsx.utils.json_to_sheet(convertUsersToExport(users));
    var wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, userWS, "Người dùng");

    var excelBinary = xlsx.write(wb, { bookType: 'xlsx', type: 'binary' })

    fs.writeFileSync(excelOutput, excelBinary, 'binary')

    res.download(excelOutput, (err) => {
        if (err) {
            fs.unlinkSync(excelOutput);
            res.status(400).send({ error: "Không thể tải tệp excel" })
        }
        fs.unlinkSync(excelOutput);
    })
}

module.exports.exportActivity = async (req, res) => {
    const activityId = req.params.activityId;
    const excelOutput = Date.now() + "activity.xlsx";
    const activity = await Activity.findById(activityId)
        .populate('club')
        .populate('collaborators')
        .lean();

    const club = await Club.findById(activity.club._id)
        .populate('members')
        .populate('leader')
        .populate('treasurer')
        .lean();

    let members = [...club.members]
    members.push(club.leader)
    members.push(club.treasurer)

    var activityWS = xlsx.utils.json_to_sheet(converActivityToExport(activity));
    var collaboratorsWS = xlsx.utils.json_to_sheet(convertUsersToExport(activity.collaborators));
    var membersWS = xlsx.utils.json_to_sheet(convertUsersToExport(members));
    var wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, activityWS, "Hoạt động");
    xlsx.utils.book_append_sheet(wb, membersWS, "Thành viên");
    xlsx.utils.book_append_sheet(wb, collaboratorsWS, "Cộng tác viên");
    
    var excelBinary = xlsx.write(wb, { bookType: 'xlsx', type: 'binary' })

    fs.writeFileSync(excelOutput, excelBinary, 'binary')

    res.download(excelOutput, (err) => {
        if (err) {
            fs.unlinkSync(excelOutput);
            res.status(400).send({ error: "Không thể tải tệp excel" })
        }
        fs.unlinkSync(excelOutput);
    })
}