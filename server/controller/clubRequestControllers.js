const ClubRequest = require("../models/ClubRequest");
const Club = require("../models/Club");
const User = require("../models/User")
const mongoose = require("mongoose");
const { saveLog } = require("../helper/LogHelper");

async function userAcceptJoinClubRequest(clubId, userId) {
  try {
    user_oid = mongoose.Types.ObjectId(userId);
    const club = await Club.findById(clubId);
    if (club.leader === user_oid) {
      return;
    }
    if (club.treasurer === user_oid) {
      return;
    }
    if (club.members.includes(user_oid)) {
      return;
    }
    club.members.push(user_oid);
    return await club.save()
  } catch (err) {
    console.log("joinClubRequest", err);
  }
}

function add_filter(reqQuery) {
  const { type, status, club, user } = reqQuery
  let query = null;
  if (type !== undefined) {
    if (Array.isArray(type)) {
      query = { ...query, type: { $in: type } }
    } else {
      query = { ...query, type: type }
    }
  }
  if (status !== undefined) {
    if (Array.isArray(status)) {
      query = { ...query, status: { $in: status } }
    } else {
      query = { ...query, status: status }
    }
  }
  if (club !== undefined) {
    if (Array.isArray(club)) {
      query = { ...query, club: { $in: club } }
    } else {
      query = { ...query, club: club }
    }
  }
  if (user !== undefined) {
    if (Array.isArray(user)) {
      query = { ...query, user: { $in: user } }
    } else {
      query = { ...query, user: user }
    }
  }
  return query
}

module.exports.getList = (req, res) => {
  const query = add_filter(req.query)
  ClubRequest.find(query)
    .populate('sender')
    .populate('club')
    // .populate('user')
    .then(result => {
      res.status(200).send(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: err.message });
    })
}

module.exports.create = async (req, res) => {
  const { sender, club, user, type } = req.body;
  try {
    const userExist = await User.findById(user)
    if (userExist.username.includes("admin")) {
      res.status(400).send({ error: "Không thể yêu cầu tham gia." });
      return
    }
    const clubRequest = new ClubRequest({ sender, club, user, type });
    let saveClubRequest = await clubRequest.save()
    res.status(200).send(saveClubRequest)
  } catch (err) {
    console.log("ActivityRequest Create", err.message)
    res.status(500).send({ error: err.message });
  }
};

module.exports.updateStatus = async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;

  ClubRequest.findById(requestId, async function (err, doc) {
    if (err) {
      res.status(400).send({ error: err.message });
      return;
    }
    doc.status = status;
    if (status === 1) {
      // Accept
      await userAcceptJoinClubRequest(doc.club, doc.user)
      await saveLog(doc.club, "member_join", doc.user)
    } else if (status === 2) {
      // Cancel
    }
    doc.save().then((result) => {
      result
        .populate("sender")
        .populate("club")
        .populate("user")
        .execPopulate()
        .then((resData) => {
          res.status(200).send(resData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    });
  });
};
