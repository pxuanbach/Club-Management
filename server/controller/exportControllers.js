const xlsx = require("xlsx");
const fs = require("fs");
const Club = require("../models/Club");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Point = require("../models/Point");
const ClubLog = require("../models/ClubLog");
const moment = require("moment");
const { pointsOfClub } = require("./pointControllers");
const {
    convertClubsToExport,
    converActivityToExport,
    converLogsToExport,
    converMembersToExport,
    converPointsToExport,
    convertUsersToExport,
    convertGeneralInfoToExport,
    convertPointDetailsToExport
} = require("../helper/ReportDataHelper")


module.exports.exportClubs = async (req, res) => {
    const excelOutput = Date.now() + "clubs.xlsx";
    const clubs = await Club.find({})
        .populate("leader")
        .populate("treasurer")
        .lean();

    var clubWS = xlsx.utils.json_to_sheet(convertClubsToExport(clubs));
    var wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, clubWS, "Câu lạc bộ");

    var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

    fs.writeFileSync(excelOutput, excelBinary, "binary");

    res.download(excelOutput, (err) => {
        if (err) {
            fs.unlinkSync(excelOutput);
            res.status(400).send({ error: "Không thể tải tệp excel" });
        }
        fs.unlinkSync(excelOutput);
    });
};

module.exports.exportUsers = async (req, res) => {
    const excelOutput = Date.now() + "users.xlsx";
    const users = await User.find({
        username: { $nin: ["admin", "admin0"] },
    }).lean();

    var userWS = xlsx.utils.json_to_sheet(convertUsersToExport(users));
    var wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, userWS, "Người dùng");

    var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

    fs.writeFileSync(excelOutput, excelBinary, "binary");

    res.download(excelOutput, (err) => {
        if (err) {
            fs.unlinkSync(excelOutput);
            res.status(400).send({ error: "Không thể tải tệp excel" });
        }
        fs.unlinkSync(excelOutput);
    });
};

module.exports.exportActivity = async (req, res) => {
    const activityId = req.params.activityId;
    const excelOutput = Date.now() + "activity.xlsx";
    const activity = await Activity.findById(activityId)
        .populate("club")
        .populate("collaborators")
        .lean();

    const club = await Club.findById(activity.club._id)
        .populate("members")
        .populate("leader")
        .populate("treasurer")
        .lean();

    let members = [...club.members];
    members.push(club.leader);
    members.push(club.treasurer);

    var activityWS = xlsx.utils.json_to_sheet(converActivityToExport(activity));
    var collaboratorsWS = xlsx.utils.json_to_sheet(
        convertUsersToExport(activity.collaborators)
    );
    var membersWS = xlsx.utils.json_to_sheet(convertUsersToExport(members));
    var wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, activityWS, "Hoạt động");
    xlsx.utils.book_append_sheet(wb, membersWS, "Thành viên");
    xlsx.utils.book_append_sheet(wb, collaboratorsWS, "Cộng tác viên");

    var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

    fs.writeFileSync(excelOutput, excelBinary, "binary");

    res.download(excelOutput, (err) => {
        if (err) {
            fs.unlinkSync(excelOutput);
            res.status(400).send({ error: "Không thể tải tệp excel" });
        }
        fs.unlinkSync(excelOutput);
    });
};

module.exports.exportClubLogs = async (req, res) => {
    const clubId = req.params.clubId;
    const createdBy = req.params.createdBy;
    try {
        const excelOutput = Date.now().toString() + "clublogs.xlsx";
        const club = await Club.findById(clubId)
            .populate("leader")
            .populate("treasurer");
        if (club === undefined || club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const createdByUser = await User.findById(createdBy)
        if (createdByUser === undefined || createdByUser === null) {
            res.status(404).send({ error: "Không xác định được người tạo báo cáo." });
            return;
        }
        const logs = await ClubLog.find({ club: clubId }).sort({ createdAt: 1 });
        const cloneLogs = JSON.parse(JSON.stringify(logs));
        const promises = cloneLogs.map(async (log) => {
            if (
                [
                    "member_join",
                    "promote_leader",
                    "promote_treasurer",
                    "member_out",
                ].includes(log.type)
            ) {
                const user = await User.findById(log.content);
                log.content = user;
                return log;
            }
            return log;
        });
        const result = await Promise.all(promises);
        // console.log(result)
        var generalWS = xlsx.utils.json_to_sheet(
            convertGeneralInfoToExport({
                ...club._doc,
                createdBy: createdByUser,
            }),
            { skipHeader: 1 }
        );
        var logWS = xlsx.utils.json_to_sheet(converLogsToExport(result));
        var wb = xlsx.utils.book_new();

        // column width
        var generalWscols = [
            { wch: 22 },
            { wch: 30 },
        ];
        generalWS['!cols'] = generalWscols
        var logWscols = [
            { wch: 20 },
            { wch: 100 },
        ]
        logWS['!cols'] = logWscols

        xlsx.utils.book_append_sheet(wb, generalWS, "Thông tin chung");
        xlsx.utils.book_append_sheet(wb, logWS, "Nhật ký");

        var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

        fs.writeFileSync(excelOutput, excelBinary, "binary");

        res.download(excelOutput, (err) => {
            if (err) {
                fs.unlinkSync(excelOutput);
                res.status(400).send({ error: "Không thể tải tệp excel" });
            }
            fs.unlinkSync(excelOutput);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.exportMembers = async (req, res) => {
    const clubId = req.params.clubId;
    const createdBy = req.params.createdBy;
    try {
        const excelOutput = Date.now().toString() + "clubmembers.xlsx";
        const club = await Club.findById(clubId)
            .populate("leader")
            .populate("treasurer");
        if (club === undefined || club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const createdByUser = await User.findById(createdBy)
        if (createdByUser === undefined || createdByUser === null) {
            res.status(404).send({ error: "Không xác định được người tạo báo cáo." });
            return;
        }
        const members = await User.find({
            _id: { $in: [...club.members, club.leader, club.treasurer] },
        });
        let cloneMembers = JSON.parse(JSON.stringify(members));
        const logType = ["promote_leader", "promote_treasurer", "member_join"];
        const promises = cloneMembers.map(async (member) => {
            const log = await ClubLog.find({
                type: { $in: logType },
                content: member._id,
                club: clubId,
            }).sort({ createdAt: -1 });
            if (log.length > 0) {
                member.dateJoin = log[0].createdAt;
            }
            return member;
        });
        const result = await Promise.all(promises);

        var generalWS = xlsx.utils.json_to_sheet(
            convertGeneralInfoToExport({
                ...club._doc,
                createdBy: createdByUser,
            }),
            { skipHeader: 1 }
        );
        var membersWS = xlsx.utils.json_to_sheet(converMembersToExport(result));
        var wb = xlsx.utils.book_new();

        // column width
        var generalWscols = [
            { wch: 22 },
            { wch: 30 },
        ];
        generalWS['!cols'] = generalWscols
        var membersWscols = [
            { wch: 25 },    // id
            { wch: 12 },    // username
            { wch: 20 },    // name
            { wch: 10 },    // gender
            { wch: 25 },    // email
            { wch: 12 },    // phone
            { wch: 50 },    // facebook
            { wch: 20 },    // dateJoin
        ]
        membersWS['!cols'] = membersWscols

        xlsx.utils.book_append_sheet(wb, generalWS, "Thông tin chung");
        xlsx.utils.book_append_sheet(wb, membersWS, "Thành viên");

        var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

        fs.writeFileSync(excelOutput, excelBinary, "binary");

        res.download(excelOutput, (err) => {
            if (err) {
                fs.unlinkSync(excelOutput);
                res.status(400).send({ error: "Không thể tải tệp excel" });
            }
            fs.unlinkSync(excelOutput);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.exportMemberPoints = async (req, res) => {
    const clubId = req.params.clubId;
    const createdBy = req.params.createdBy;
    const { startDate, endDate, justCurrentMember } = req.query;
    try {
        const excelOutput = Date.now().toString() + "clubmembers.xlsx";
        const club = await Club.findById(clubId)
            .populate("leader")
            .populate("treasurer");
        if (club === undefined || club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const createdByUser = await User.findById(createdBy)
        if (createdByUser === undefined || createdByUser === null) {
            res.status(404).send({ error: "Không xác định được người tạo báo cáo." });
            return;
        }

        const points = await pointsOfClub(
            club,
            startDate,
            endDate,
            justCurrentMember,
            ""
        );

        var generalWS = xlsx.utils.json_to_sheet(
            convertGeneralInfoToExport(
                {
                    ...club._doc,
                    createdBy: createdByUser,
                },
                "member_point"
            ),
            { skipHeader: 1 }
        );
        const jsonObjArr = [
            {
                key: "Từ ngày",
                value: moment(startDate).format("DD/MM/YYYY HH:mm:ss"),
            },
            {
                key: "Đến ngày",
                value: moment(endDate).format("DD/MM/YYYY HH:mm:ss"),
            },
            {
                key: "Chỉ thành viên hiện tại",
                value: justCurrentMember,
            }
        ]
        var pointsWS = xlsx.utils.json_to_sheet(jsonObjArr, { skipHeader: 1 }); 
        xlsx.utils.sheet_add_json(pointsWS, converPointsToExport(points), { origin: "A5" })
        var wb = xlsx.utils.book_new();

        // column width
        var generalWscols = [
            { wch: 22 },
            { wch: 30 },
        ];
        generalWS['!cols'] = generalWscols
        var pointsWscols = [
            { wch: 25 },    // id
            { wch: 20 },    // username, filter date
            { wch: 20 },    // name
            { wch: 25 },    // email
            { wch: 10 },    // point
        ]
        pointsWS['!cols'] = pointsWscols

        xlsx.utils.book_append_sheet(wb, generalWS, "Thông tin chung");
        xlsx.utils.book_append_sheet(wb, pointsWS, "Bảng điểm");

        var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

        fs.writeFileSync(excelOutput, excelBinary, "binary");

        res.download(excelOutput, (err) => {
            if (err) {
                fs.unlinkSync(excelOutput);
                res.status(400).send({ error: "Không thể tải tệp excel" });
            }
            fs.unlinkSync(excelOutput);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.exportUserPointsOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const createdBy = req.params.createdBy;
    const userId = req.params.userId;
    const { startDate, endDate } = req.query;
    try {
        const excelOutput = Date.now().toString() + "memberpoints.xlsx";
        const club = await Club.findById(clubId)
            .populate("leader")
            .populate("treasurer");
        if (club === undefined || club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const createdByUser = await User.findById(createdBy)
        if (createdByUser === undefined || createdByUser === null) {
            res.status(404).send({ error: "Không xác định được người tạo báo cáo." });
            return;
        }
        const user = await User.findById(userId)
        if (user === undefined || user === null) {
            res.status(404).send({ error: "Không xác định được người được tạo báo cáo." });
            return;
        }

        const points = await Point.find({
            club: clubId,
            user: userId,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
        }).populate('user')
            .populate('author')
            .sort({ createdAt: -1 })
        let totalPoint = 0
        points.map(point => {
            totalPoint += point.value
        })

        var generalWS = xlsx.utils.json_to_sheet(
            convertGeneralInfoToExport(
                {
                    ...club._doc,
                    createdBy: createdByUser,
                },
            ),
            { skipHeader: 1 }
        );
        const jsonObjArr = [
            {
                key: "Từ ngày",
                value: moment(startDate).format("DD/MM/YYYY HH:mm:ss"),
            },
            {
                key: "Đến ngày",
                value: moment(endDate).format("DD/MM/YYYY HH:mm:ss"),
            },
            {
                key: "Thành viên",
                value: user.name,
            },
            {
                key: "MSSV",
                value: user.username,
            },
            {
                key: "Email",
                value: user.email,
            },
            {
                key: "Tổng điểm",
                value: totalPoint,
            },
        ]
        var pointDetailWS = xlsx.utils.json_to_sheet(jsonObjArr, { skipHeader: 1 }); 
        xlsx.utils.sheet_add_json(pointDetailWS, convertPointDetailsToExport(points), { origin: "A8" })
        var wb = xlsx.utils.book_new();

        // column width
        var generalWscols = [
            { wch: 22 },
            { wch: 30 },
        ];
        generalWS['!cols'] = generalWscols
        var pointDetailWscols = [
            { wch: 25 },    // id
            { wch: 32 },    // title
            { wch: 20 },    // createdAt
            { wch: 18 },    // name
            { wch: 18 },    // mssv
            { wch: 24 },    // email
            { wch: 8 },    // point
        ]
        pointDetailWS['!cols'] = pointDetailWscols

        xlsx.utils.book_append_sheet(wb, generalWS, "Thông tin chung");
        xlsx.utils.book_append_sheet(wb, pointDetailWS, "Bảng điểm chi tiết");

        var excelBinary = xlsx.write(wb, { bookType: "xlsx", type: "binary" });

        fs.writeFileSync(excelOutput, excelBinary, "binary");

        res.download(excelOutput, (err) => {
            if (err) {
                fs.unlinkSync(excelOutput);
                res.status(400).send({ error: "Không thể tải tệp excel" });
            }
            fs.unlinkSync(excelOutput);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}