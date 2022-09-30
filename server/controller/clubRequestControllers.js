const ClubRequest = require("../models/ClubRequest");
const Club = require("../models/Club");
const mongoose = require("mongoose");

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

module.exports.create = (req, res) => {
  const { sender, club, user, type } = req.body;
  const clubRequest = new ClubRequest({ sender, club, user, type });
  clubRequest
    .save()
    .then((result) => {
      result
        .populate("sender")
        .populate("club")
        .populate("user")
        .execPopulate()
        .then((resData) => {
          res.status(201).send(resData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
      //console.log(result)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err.message });
    });
};

module.exports.update_status = async (req, res) => {
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
