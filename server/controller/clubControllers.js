const {
  ConvertClub,
  ConvertClubs,
  ConvertUser,
  ConvertUsers,
} = require("../helper/ConvertDataHelper");
const { saveLog, deleteLogOfClub } = require("../helper/LogHelper");
const Club = require("../models/Club");
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const FundHistory = require("../models/FundHistory");
const Group = require("../models/Group");
const Activity = require("../models/Activity");
const ClubLog = require("../models/ClubLog");
const ClubRequest = require("../models/ClubRequest");
const cloudinary = require("../helper/Cloudinary");
const fs = require("fs");
const Buffer = require("buffer").Buffer;
const mongoose = require("mongoose");

module.exports.create = async (req, res) => {
  const files = req.files;
  const { name, description, leader, treasurer } = req.body;
  let img_url = "";
  let cloudinary_id = "";
  try {
    if (files.length > 0) {
      const { path } = files[0];

      const newPath = await cloudinary.uploader
        .upload(path, {
          resource_type: "auto",
          folder: "Club-Management/Club-Avatar",
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: err.message,
          });
        });
      fs.unlinkSync(path);
      img_url = newPath.url;
      cloudinary_id = newPath.public_id;
    }
    const club = new Club({
      name,
      img_url,
      cloudinary_id,
      description,
      leader,
      treasurer,
    });

    const saveClub = await club.save();
    await saveLog(saveClub._id, "club_created", "");
    let users = await User.find({ _id: { $in: [leader, treasurer] } });
    users.forEach(async (user) => {
      user.clubs.push(saveClub._id);
      if (user._id.toString() === leader) {
        await saveLog(saveClub._id, "promote_leader", user._id);
      } else {
        await saveLog(saveClub._id, "promote_treasurer", user._id);
      }
      await user.save();
    });
    await ChatRoom.create({ room_id: saveClub._id });
    const result = await saveClub
      .populate("leader")
      .populate("treasurer")
      .execPopulate();
    res.status(201).send(ConvertClub(result));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.verifyclub = async (req, res, next) => {
  const club_id = req.params.club_id;

  const club = await Club.findById(club_id)
    .populate("leader")
    .populate("treasurer");

  if (club) {
    //console.log(club)
    if (club.isblocked) {
      res.status(400).json({ club: "blocked" });
    } else {
      res.status(200).json(club);
    }
  } else {
    res.status(400).json({ club: "none" });
  }
};

module.exports.getList = async (req, res) => {
  const userId = req.params.userId;
  //console.log(typeof isAdmin, userId)
  let query = {
    $or: [{ members: userId }, { leader: userId }, { treasurer: userId }],
  };
  // if (isAdmin === 'true') {
  //     query = {}
  // } else {
  //     query = { $or: [{ members: userId }, { leader: userId }, { treasurer: userId }] }
  // }
  //console.log(query)

  var clubs = await Club.find(query).populate("leader").populate("treasurer");

  if (clubs.length) {
    res.status(200).send(ConvertClubs(clubs));
  } else {
    res.status(200).json({ clubs: [] });
  }
};

module.exports.getListNotJoin = async (req, res) => {
  const userId = req.params.userId;
  const { isblocked } = req.query;
  //console.log(typeof isAdmin, userId)
  let query = {
    $nor: [{ members: userId }, { leader: userId }, { treasurer: userId }],
  };
  if (isblocked !== undefined) {
    if (Array.isArray(isblocked)) {
      query = { ...query, isblocked: { $in: isblocked } };
    } else {
      query = { ...query, isblocked: isblocked };
    }
  }

  var clubs = await Club.find(query).populate("leader").populate("treasurer");

  if (clubs.length) {
    res.status(200).send(ConvertClubs(clubs));
  } else {
    res.status(200).json({ clubs: [] });
  }
};

module.exports.getOne = async (req, res) => {
  const clubId = req.params.clubId;

  Club.findById(clubId)
    .populate("leader")
    .populate("treasurer")
    .then((result) => {
      res.status(200).send(ConvertClub(result));
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports.getMembers = async (req, res) => {
  const clubId = req.params.clubId;

  Club.findById(clubId)
    .then((club) => {
      User.find({ _id: { $in: club.members } })
        .then((users) => {
          res.status(200).send(ConvertUsers(users));
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports.getMembersJoinLogs = async (req, res) => {
  const clubId = req.params.clubId;
  try {
    const club = await Club.findById(clubId);
    if (club === undefined || club === null) {
      res.status(404).send({ error: "Không tìm thấy câu lạc bộ." });
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
        member.dateJoin = log[0].createdAt
      }
      return member
    });
    const result = await Promise.all(promises);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.getUsersNotMembers = async (req, res) => {
  const clubId = req.params.clubId;
  try {
    const club = await Club.findById(clubId);
    const users = await User.find({
      $and: [
        { _id: { $nin: club.members } },
        { _id: { $nin: [club.leader, club.treasurer] } },
        { username: { $nin: ["admin", "admin0"] } },
      ],
    }).limit(20);
    res.status(200).send(ConvertUsers(users));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.search = async (req, res) => {
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  await Club.find({
    name: { $regex: searchValue },
  })
    .populate("leader")
    .populate("treasurer")
    .then((clubs) => {
      res.status(200).send(ConvertClubs(clubs));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

module.exports.userSearch = (req, res) => {
  const userId = req.params.userId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  User.findById(userId).then((user) => {
    Club.find({
      $and: [{ name: { $regex: searchValue } }, { _id: { $in: user.clubs } }],
    })
      .populate("leader")
      .populate("treasurer")
      .then((clubs) => {
        res.status(200).send(ConvertClubs(clubs));
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  });
};

module.exports.userSearchNotJoin = (req, res) => {
  const userId = req.params.userId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  User.findById(userId).then((user) => {
    Club.find({
      $and: [
        { name: { $regex: searchValue } },
        { _id: { $nin: user.clubs } },
        { isblocked: false },
      ],
    })
      .populate("leader")
      .populate("treasurer")
      .then((clubs) => {
        res.status(200).send(ConvertClubs(clubs));
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  });
};

module.exports.searchMembers = async (req, res) => {
  const clubId = req.params.clubId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  Club.findById(clubId)
    .then((club) => {
      User.find({
        $and: [
          { _id: { $in: club.members } },
          {
            $or: [
              { username: { $regex: searchValue } },
              { name: { $regex: searchValue } },
              { email: { $regex: searchValue } },
            ],
          },
        ],
      })
        .then((users) => {
          //console.log(users)
          res.status(200).send(ConvertUsers(users));
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

module.exports.searchUsersNotMembers = async (req, res) => {
  const clubId = req.params.clubId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  Club.findById(clubId)
    .then((club) => {
      User.find({
        $and: [
          { _id: { $nin: club.members } },
          { _id: { $nin: [club.leader, club.treasurer] } },
          { username: { $nin: ["admin", "admin0"] } },
          {
            $or: [
              { username: { $regex: searchValue } },
              { name: { $regex: searchValue } },
              { email: { $regex: searchValue } },
            ],
          },
        ],
      })
        .limit(20)
        .then((users) => {
          res.status(200).send(ConvertUsers(users));
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
};

module.exports.addMembers = async (req, res) => {
  const { clubId, users } = req.body;
  // console.log(users)
  try {
    let club = await Club.findById(clubId);
    users.forEach(async (uid) => {
      club.members.push(uid);
      let user = await User.findById(uid);
      user.clubs.push(clubId);
      await user.save();
      await saveLog(clubId, "member_join", uid);
      await ClubRequest.deleteMany({ status: 0, user: uid, club: clubId });
    });
    const saveClub = await club.save();
    const result = await saveClub
      .populate("leader")
      .populate("treasurer")
      .execPopulate();
    res.status(200).send(ConvertClub(result));
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.update = async (req, res) => {
  const clubId = req.params.clubId;
  const { name, description, new_img_url, new_cloud_id, cur_cloud_id } =
    req.body;
  //console.log(name, description, new_img_url, new_cloud_id, cur_cloud_id)

  await Club.findById(clubId, async function (err, doc) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }

    doc.name = name;
    doc.description = description;

    if (new_img_url) {
      await cloudinary.uploader.destroy(cur_cloud_id, function (result) {
        console.log(result);
      });
      doc.img_url = new_img_url;
      doc.cloudinary_id = new_cloud_id;
    }

    doc.save().then((updatedClub) => {
      updatedClub
        .populate("leader")
        .populate("treasurer")
        .execPopulate()
        .then((result) => {
          res.status(200).send(ConvertClub(result));
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ error: err.message });
        });
    });
  });
};

module.exports.block = async (req, res) => {
  const clubId = req.params.clubId;
  try {
    let club = await Club.findById(clubId);
    if (club === undefined || club === null) {
      res.status(404).send({ error: "Không tìm thấy câu lạc bộ nào." });
      return;
    }
    club.isblocked = !club.isblocked;
    const saveClub = await club.save();
    const result = await saveClub
      .populate("leader")
      .populate("treasurer")
      .execPopulate();
    if (result.isblocked === true) {
      // club_blocked
      await saveLog(result._id, "club_blocked", "");
    } else {
      // club_unblock
      await saveLog(result._id, "club_unblock", "");
    }
    res.status(200).send(ConvertClub(result));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.promote = async (req, res) => {
  const clubId = req.params.clubId;
  const { position, cur_member_id, new_member_id } = req.body;

  try {
    const club = await Club.findById(clubId);
    const newPromotedMember = await User.findById(new_member_id);

    if (position === "leader") {
      club.leader = newPromotedMember._id;
    } else if (position === "treasurer") {
      club.treasurer = newPromotedMember._id;
    }

    //exchange new and current leader id
    var newMembers = club.members.filter(function (value, index, arr) {
      //console.log('new leader id: ', new_leader_id)
      return value.toString() !== new_member_id;
    });
    // console.log('new member:', newMembers)
    club.members = newMembers;
    //console.log('current leader id: ', cur_leader_id)
    club.members.push(cur_member_id);
    //console.log('add cur leader id:', doc.members)
    await club.save();
    await saveLog(clubId, "promote_" + position, new_member_id);
    res.status(200).send(newPromotedMember);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

module.exports.removeMember = async (req, res) => {
  const clubId = req.params.clubId;
  const { userId } = req.body;

  await Club.findById(clubId, async function (err, doc) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }

    var newMembers = doc.members.filter(function (value, index, arr) {
      return value.toString() !== userId;
    });
    doc.members = newMembers;
    doc.save();
    await saveLog(clubId, "member_out", userId);

    User.findById(userId, function (err, doc) {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      var newClubs = doc.clubs.filter(function (value, index, arr) {
        return value.toString() != clubId;
      });
      doc.clubs = newClubs;
      doc
        .save()
        .then((user) => {
          //io.emit('removed-user-from-club', club_id, ConvertUser(user))
          res.status(200).send(ConvertUser(user));
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    }).catch((err) => {
      res.status(500).send({ error: err.message });
    });
  }).catch((err) => {
    console.log(err);
    res.status(400).send({ error: err.message });
  });
};

module.exports.removeMembers = async (req, res) => {
  const clubId = req.params.clubId;
  const { members } = req.body;
  try {
    const club = await Club.findById(clubId);

    await Club.updateOne(
      { _id: clubId },
      { $pull: { members: { $in: members } } }
    );
    const users = await User.updateMany(
      { _id: { $in: members } },
      { $pull: { clubs: clubId } }
    );
    const promises = members.map(async (member) => {
      if (club.leader.toString() !== member && club.treasurer.toString() !== member) {
        const log = await saveLog(clubId, "member_out", member);
        return log;
      }
    });
    const result = await Promise.all(promises);
    res.status(200).send(users);
  } catch (err) {
    console.log("🚀 ~ file: clubControllers.js:551 ~ module.exports.removeMembers= ~ err:", err)
    res.status(500).send({ error: err.message });
  }
};

module.exports.updateFundConfig = async (req, res) => {
  const clubId = req.params.clubId;
  const { monthlyFund, monthlyFundPoint } = req.body;
  try {
    let club = await Club.findById(clubId)
    club.monthlyFund = monthlyFund
    club.monthlyFundPoint = monthlyFundPoint
    const savedClub = await club.save()
    const result = await savedClub
      .populate("leader")
      .populate("treasurer")
      .execPopulate();
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.delete = async (req, res) => {
  const clubId = req.params.clubId;
  const encodedCloudId = req.params.cloudId;
  const buff = Buffer.from(encodedCloudId, "base64");
  const cloudId = buff.toString("utf8");
  //console.log(cloudId)

  await Club.findByIdAndDelete(clubId, async function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err.message });
    } else {
      await cloudinary.uploader.destroy(cloudId, function (result) {
        console.log(result);
      });
      //console.log('Delete club:', doc)
      //Chat room
      await ChatRoom.deleteMany({ room_id: clubId });
      //Message
      await Message.deleteMany({ room_id: clubId });
      //Fund History
      await FundHistory.deleteMany({ club: clubId });
      //Group
      await Group.deleteMany({ club: clubId });
      //Activity
      await Activity.deleteMany({ club: clubId });
      //User
      await User.updateMany({ clubs: clubId }, { $pull: { clubs: clubId } });
      // Log
      await deleteLogOfClub(clubId);

      res.status(200).send(clubId);
    }
  });
};
