const moment = require("moment");

const convertClubsToExport = (clubs) => {
    let dataArr = [];

    clubs.forEach((club) => {
        const data = {
            Mã: club._id.toString(),
            Tên: club.name,
            Quỹ: club.fund,
            "Trưởng câu lạc bộ": club.leader.name,
            "MSSV trưởng CLB": club.leader.username,
            "Email trưởng CLB": club.leader.email,
            "Thủ quỹ": club.treasurer.name,
            "MSSV thủ quỹ": club.treasurer.username,
            "Email thủ quỹ": club.treasurer.email,
            "Thành viên": club.members.length + 2,
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
};

const convertGeneralInfoToExport = (data, type = "") => {
    // data ~~ club
    // console.log(data);
    let obj = {
        "Thời gian xuất báo cáo": moment().format("DD/MM/YYYY HH:mm:ss"),
        "Tên người tạo": data.createdBy.name,
        "MSSV người tạo": data.createdBy.username,
        "Email người tạo": data.createdBy.email
    };
    obj = {
        ...obj,
        "Mã CLB": data._id.toString(),
        "Tên CLB": data.name,
        "Quỹ CLB": data.fund,
        "Số lượng thành viên": data.members.length + 2,
        "Trưởng CLB": data.leader.name,
        "MSSV trưởng CLB": data.leader.username,
        "Email trưởng CLB": data.leader.email,
        "Thủ quỹ": data.treasurer.name,
        "MSSV thủ quỹ": data.treasurer.username,
        "Email thủ quỹ": data.treasurer.email,
    };
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

const convertUsersToExport = (users) => {
    let dataArr = [];

    users.forEach((user) => {
        const data = {
            "Mã": user._id.toString(),
            "Mã sinh viên": user.username,
            "Tên": user.name,
            "Giới tính": user.gender,
            "Email": user.email,
            "Số điện thoại": user.phone,
            "Facebook": user.facebook,
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
};

const convertActivityToExport = (activity) => {
    let obj = {
        "Mã hoạt động": activity._id.toString(),
        "Tên hoạt động": activity.title,
        "Tạo ngày": moment(activity.createdAt).format("DD/MM/YYYY HH:mm:ss"),
        "Ngày bắt đầu": moment(activity.startDate).format("DD/MM/YYYY HH:mm:ss"),
        "Ngày kết thúc": moment(activity.endDate).format("DD/MM/YYYY HH:mm:ss"),
    }

    return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

const convertLogsToExport = (logs) => {
    let dataArr = [];
    logs.forEach((log) => {
        const data = {
            "Thời gian": moment(log.createdAt).format("DD/MM/YYYY HH:mm:ss"),
            "Nội dung":
                log.content._id !== undefined
                    ? log.content.username +
                    " - " +
                    log.content.name +
                    " " +
                    log.mean.toLowerCase()
                    : log.mean,
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
};

const convertMembersToExport = (members) => {
    let dataArr = [];
    members.forEach((member) => {
        const data = {
            "Mã thành viên": member._id.toString(),
            "Mã sinh viên": member.username,
            "Tên": member.name,
            "Giới tính": member.gender,
            "Email": member.email,
            "Số điện thoại": member.phone,
            "Facebook": member.facebook,
            "Ngày tham gia": moment(member.dateJoin).format("DD/MM/YYYY HH:mm:ss"),
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
};

const convertPointsToExport = (points) => {
    let dataArr = [];
    points.forEach((point) => {
        const data = {
            "Mã thành viên": point._id.toString(),
            "Mã sinh viên": point.data.username,
            "Tên": point.data.name,
            "Giới tính": point.data.gender,
            "Email": point.data.email,
            "Số điện thoại": point.data.phone,
            "Facebook": point.data.facebook,
            "Điểm": point.point,
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
};

const convertPointDetailsToExport = (points) => {
    let dataArr = [];
    points.forEach((point) => {
        const data = {
            "Mã phiếu điểm": point._id.toString(),
            "Nội dung": point.title,
            "Ngày tạo": moment(point.createdAt).format("DD/MM/YYYY HH:mm:ss"),
            "Người xác nhận": point.author.name,
            "MSSV người xác nhận": point.author.username,
            "Email người xác nhận": point.author.email,
            "Điểm": point.value,
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
}

const convertFundHistoriesToExport = (fundhistories) => {
    let dataArr = [];
    fundhistories.forEach((fh) => {
        const data = {
            "Mã phiếu": fh._id.toString(),
            "Nội dung": fh.content,
            "Loại": fh.type,
            "Số tiền": fh.total,
            "Người xác nhận": fh.author.name,
            "MSSV người xác nhận": fh.author.username,
            "Email người xác nhận": fh.author.email,
        };
        //console.log(data)
        dataArr.push(data);
    });

    return dataArr;
}

module.exports = {
    convertClubsToExport,
    convertActivityToExport,
    convertLogsToExport,
    convertMembersToExport,
    convertPointsToExport,
    convertUsersToExport,
    convertGeneralInfoToExport,
    convertPointDetailsToExport,
    convertFundHistoriesToExport
}