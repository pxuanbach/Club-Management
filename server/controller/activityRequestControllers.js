const ActivityRequest = require("../models/ActivityRequest");
const Activity = require("../models/Activity");
const User = require("../models/User");
const moment = require('moment')

function add_filter(reqQuery) {
  const { type, status, activity, user, club } = reqQuery;
  let query = null;
  if (type !== undefined) {
    if (Array.isArray(type)) {
      query = { ...query, type: { $in: type } };
    } else {
      query = { ...query, type: type };
    }
  }
  if (status !== undefined) {
    if (Array.isArray(status)) {
      query = { ...query, status: { $in: status } };
    } else {
      query = { ...query, status: status };
    }
  }
  if (activity !== undefined) {
    if (Array.isArray(activity)) {
      query = { ...query, activity: { $in: activity } };
    } else {
      query = { ...query, activity: activity };
    }
  }
  if (club !== undefined) {
    if (Array.isArray(club)) {
      query = { ...query, club: { $in: club } };
    } else {
      query = { ...query, club: club };
    }
  }
  if (user !== undefined) {
    if (Array.isArray(user)) {
      query = { ...query, user: { $in: user } };
    } else {
      query = { ...query, user: user };
    }
  }
  return query;
}

module.exports.getList = (req, res) => {
  const query = add_filter(req.query);
  ActivityRequest.find(query).sort({ createdAt: -1 })
    // .populate('sender')
    .populate("activity")
    .populate("club")
    .populate("user")
    // .populate('user')
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

module.exports.create = async (req, res) => {
  const { sender, activity, user, type, club } = req.body;
  try {
    const currentDate = moment()
    const activityObj = await Activity.findById(activity)
    if (activityObj.endDate < currentDate) {
      res.status(400).send({ error: "Hoạt động này đã kết thúc." });
      return;
    }
    const userExist = await User.findById(user);
    if (userExist.username.includes("admin")) {
      res.status(400).send({ error: "Không thể yêu cầu tham gia." });
      return;
    }
    const requestExists = await ActivityRequest.find({ activity: activity, user: user, status: 0 })
    if (requestExists.length > 0) {
      console.log(requestExists)
      res.status(400).send({ error: "Kiểm tra trang lời mời của bạn." });
      return
    }
    const activityRequest = new ActivityRequest({
      sender,
      activity,
      user,
      type,
      club,
    });
    let saveActivityRequest = await activityRequest.save();
    res.status(200).send(saveActivityRequest);
  } catch (err) {
    console.log("ActivityRequest Create", err.message);
    res.status(500).send({ error: err.message });
  }
};

module.exports.createMulti = async (req, res) => {
  const { sender, activity, club, users, type } = req.body; // users is array
  try {
    const currentDate = moment()
    const activityObj = await Activity.findById(activity)
    if (activityObj.endDate < currentDate) {
      res.status(400).send({ error: "Hoạt động này đã kết thúc." });
      return;
    }
    const userExists = await User.find({ _id: { $in: users } });
    userExists.map((uExist) => {
      if (uExist.username.includes("admin")) {
        res
          .status(400)
          .send({
            error:
              type === "ask"
                ? "Không thể yêu cầu tham gia."
                : "Không thể mời người này.",
          });
        return;
      }
    });

    const requestExists = await ActivityRequest.find({
      activity, activity,
      club: club,
      user: { $in: users },
      status: 0,
    }).populate('user')
    if (requestExists.length > 0) {
      res.status(400)
        .send({
          error: type === "ask" ? "Đã yêu cầu tham gia." : `${requestExists[0].user.name} đã có yêu cầu.`,
        });
      return;
    }

    let activityRequestArr = [];
    users.map((uid) => {
      activityRequestArr.push({
        activity: activity,
        sender: sender,
        club: club,
        user: uid,
        type: type,
      });
    });
    const result = await ActivityRequest.insertMany(activityRequestArr);
    res.status(200).send(result);
  } catch (err) {
    console.log("ActivityRequest Create", err.message);
    res.status(500).send({ error: err.message });
  }
};


module.exports.updateStatus = async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;
  // console.log("updateStatus", status)
  try {
    let activityRequest = await ActivityRequest.findById(requestId);

    if (activityRequest.status !== 0) {
      res.status(400).send({ error: "Lời mời này đã thay đổi!" });
      return;
    }
    activityRequest.status = status;
    if (status === 1) {
      // Accept
      let activity = await Activity.findById(activityRequest.activity);
      activity.collaborators.push(activityRequest.user);
      await activity.save();
    } else if (status === 2) {
      // Cancel
    }
    const saveActivityRequest = await activityRequest.save();
    const result = await saveActivityRequest
      .populate("user")
      .populate("activity")
      .populate("club")
      .execPopulate();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};
