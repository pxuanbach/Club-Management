const Activity = require("../models/Activity");
const ActivityCard = require("../models/ActivityCard");
const ActivityRequest = require("../models/ActivityRequest");
const Point = require("../models/Point");
const ActivityPoint = require("../models/ActivityPoint");
const User = require("../models/User");
const Group = require("../models/Group");
const cloudinary = require("../helper/Cloudinary");
const fs = require("fs");
const async = require("async");
const Buffer = require("buffer").Buffer;
const moment = require("moment");
const mongoose = require("mongoose");
const {
  isElementInArray,
  isElementInArrayObject,
  notContainsNullArray,
  uniqueArray,
  elementInArrayObject,
  uniqueIdObjArray,
} = require("../helper/ArrayHelper");

function isUserJoined(userId, card) {
  let isJoined = false;
  if (isElementInArray(userId, card.userJoin)) {
    isJoined = true;
  }

  card.groupJoin.forEach((group) => {
    if (isElementInArray(userId, group.members)) {
      // console.log(group)
      isJoined = true;
    }
  });

  return isJoined;
}

function isGroupJoined(groupId, card) {
  if (isElementInArrayObject(groupId, card.groupJoin)) {
    return true;
  }
  return false;
}

function getAllMembersInCard(card, members) {
  let membersInCard = [];
  card.userJoin.forEach((user) => {
    if (isElementInArray(user, members)) {
      membersInCard.push(user);
    }
  });

  card.groupJoin.forEach((group) => {
    membersInCard.push(...group.members);
  });
  return uniqueArray(membersInCard);
}

/** 
    @return {Array} Object
    [
        {
            _id: uu192adjsdanbjsakd,
            count: 2
        }
    ]
*/
function getAllMembersInCards(cards, members) {
  let membersInCard = [];
  cards.map((card) => {
    card.userJoin.forEach((user) => {
      if (isElementInArray(user, members)) {
        const { element, index } = elementInArrayObject(user, membersInCard);
        if (index >= 0) {
          membersInCard[index].count += 1;
        } else {
          membersInCard.push({
            _id: user,
            count: 1,
          });
        }
      }
    });
    card.groupJoin.forEach((group) => {
      group.members.forEach((member) => {
        if (isElementInArray(member, members)) {
          const { element, index } = elementInArrayObject(
            member,
            membersInCard
          );
          if (index >= 0) {
            membersInCard[index].count += 1;
          } else {
            membersInCard.push({
              _id: member,
              count: 1,
            });
          }
        }
      });
      // membersInCard.push(...group.members)
    });
  });
  return membersInCard;
}

function getAllCollaboratorsInCard(card, collaborators) {
  let collaboratorsInCard = [];
  card.userJoin.forEach((user) => {
    if (isElementInArray(user, collaborators)) {
      collaboratorsInCard.push(user);
    }
  });
  return uniqueArray(collaboratorsInCard);
}

/** 
    @return {Array} Object
    [
        {
            _id: uu192adjsdanbjsakd,
            count: 2
        }
    ]
*/
function getAllCollaboratorsInCards(cards, collaborators) {
  let collaboratorsInCard = [];
  cards.map((card) => {
    card.userJoin.forEach((user) => {
      if (isElementInArray(user, collaborators)) {
        const { element, index } = elementInArrayObject(
          user,
          collaboratorsInCard
        );
        if (index >= 0) {
          collaboratorsInCard[index].count += 1;
        } else {
          collaboratorsInCard.push({
            _id: user,
            count: 1,
          });
        }
      }
    });
  });
  return collaboratorsInCard;
}

async function uploadFile(files, public_id) {
  if (files.length > 0) {
    const { path } = files[0];

    const newPath = await cloudinary.uploader
      .upload(path, {
        resource_type: "auto",
        folder: "Club-Management/Activity",
      })
      .catch((error) => {
        console.log(error);
        return {
          original_filename: "",
          url: "",
          public_id: "",
        };
      });
    fs.unlinkSync(path);
    if (public_id !== "") {
      await cloudinary.uploader
        .destroy(public_id, function (result) {
          console.log("destroy image", result);
        })
        .catch((err) => {
          console.log("destroy image err ", err.message);
        });
    }
    //console.log("upload function", newPath)
    return {
      original_filename: newPath.original_filename,
      url: newPath.url,
      public_id: newPath.public_id,
    };
  }
  return {
    original_filename: "",
    url: "",
    public_id: "",
  };
}

module.exports.create = (req, res) => {
  const {
    club,
    title,
    startDate,
    endDate,
    joinPoint,
    configType,
    configMilestone,
  } = req.body;
  let boards = [
    {
      title: "Cần làm",
      cards: [],
    },
    {
      title: "Đang làm",
      cards: [],
    },
    {
      title: "Đã xong",
      cards: [],
    },
    {
      title: "Ghi chú",
      cards: [],
    },
  ];
  const sortedConfigMilestone = configMilestone.sort((a, b) => a.percentOrQuantity - b.percentOrQuantity);
  const activity = new Activity({
    club,
    title,
    startDate,
    endDate,
    boards,
    joinPoint,
    configType,
    configMilestone: sortedConfigMilestone
  });
  activity
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { activityId, columnId, title } = req.body;

  const card = new ActivityCard({
    activity: activityId,
    title,
  });

  card
    .save()
    .then((newCard) => {
      Activity.findById(activityId, function (err, doc) {
        if (err) {
          res.status(500).send({ error: "Activity load err - " + err.message });
          return;
        }

        doc.boards.forEach((col) => {
          if (col._id.toString() === columnId) {
            col.cards.push(newCard._id);
          }
        });

        doc
          .save()
          .then((result) => {
            async.forEach(
              result.boards,
              function (item, callback) {
                ActivityCard.populate(
                  item,
                  { path: "cards" },
                  function (err, output) {
                    if (err) {
                      res
                        .status(500)
                        .send({ error: "Populate err - " + err.message });
                      return;
                    }
                    callback();
                  }
                );
              },
              function (err) {
                if (err) {
                  res
                    .status(500)
                    .send({ error: "Populate complete err - " + err.message });
                  return;
                }
                res.status(200).send(result);
              }
            );
          })
          .catch((err) => {
            res.status(500).send({ error: "Save err - " + err.message });
          });
      });
    })
    .catch((err) => {
      res.status(400).json({ error: "Save err - " + err.message });
    });
};

module.exports.getList = async (req, res) => {
  const clubId = req.params.clubId;
  const { inMonth, userId, option } = req.query;
  const currentDate = moment();
  const nextMonthDate = moment().add(30, "days");
  // const nextMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  let query = { club: clubId };
  if (inMonth !== undefined) {
    query = {
      ...query,
      $or: [
        {
          startDate: {
            $gte: currentDate.toISOString(),
            $lte: nextMonthDate.toISOString(),
          },
        },
        {
          endDate: {
            $gte: nextMonthDate.toISOString(),
          },
        },
      ],
    };
  }
  if (option !== undefined) {
    // console.log(typeof(option))
    if (option === "0") {
      // future
      query = {
        ...query,
        startDate: { $gte: currentDate.toISOString() },
      };
    } else if (option === "1") {
      // current
      query = {
        ...query,
        startDate: { $lte: currentDate.toISOString() },
        endDate: { $gte: currentDate.toISOString() },
      };
    } else if (option === "2") {
      // end not sumary
      query = {
        ...query,
        endDate: { $lt: currentDate.toISOString() },
        sumary: "",
      };
    } else if (option === "3") {
      // end sumary
      query = {
        ...query,
        endDate: { $lt: currentDate.toISOString() },
        sumary: { $ne: "" },
      };
    }
  }

  const activities = await Activity.find(query);
  if (userId !== undefined) {
    const cloneActivities = JSON.parse(JSON.stringify(activities));
    const promises = cloneActivities.map(async (activity) => {
      const requests = await ActivityRequest.find({
        activity: activity._id,
        user: userId,
      });
      // console.log(request, activity._id)
      if (!Array.isArray(requests) || !requests.length) {
        activity.requested = false;
      } else {
        // status === 0 => requested = true
        // status === 1 => remove elm
        // status === 2 => requested = false
        requests.map(async (rq) => {
          if (rq.status === 0) {
            activity.requested = true;
          } else if (rq.status === 1) {
            activity = null;
          } else if (rq.status === 2) {
            activity.requested = false;
          }
        });
      }
      return activity;
    });
    const result = notContainsNullArray(await Promise.all(promises));
    // console.log(userId, result)

    res.status(200).send(result);
  } else {
    res.status(200).send(activities);
  }
};

module.exports.getOne = (req, res) => {
  const activityId = req.params.activityId;

  Activity.findById(activityId)
    .populate("club")
    .then((result) => {
      async.forEach(
        result.boards,
        function (item, callback) {
          ActivityCard.populate(
            item,
            { path: "cards" },
            function (err, output) {
              if (err) {
                res.status(500).send({ error: err.message });
                return;
              }
              callback();
            }
          );
        },
        function (err) {
          if (err) {
            res.status(500).send({ error: err.message });
            return;
          }
          res.status(200).send(result);
        }
      );
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.getCollaborators = (req, res) => {
  const activityId = req.params.activityId;

  Activity.findById(activityId)
    .populate("collaborators")
    .then((result) => {
      res.status(200).send(result.collaborators);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.getUsersNotCollaborators = (req, res) => {
  const activityId = req.params.activityId;

  Activity.findById(activityId)
    .populate("club")
    .then((result) => {
      User.find({
        $and: [
          { _id: { $nin: result.club.members } },
          { _id: { $nin: result.collaborators } },
          { _id: { $nin: [result.club.leader, result.club.treasurer] } },
          { username: { $nin: ["admin", "admin0"] } },
        ],
      })
        .limit(20)
        .then((users) => {
          res.status(200).send(users);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.search = (req, res) => {
  const clubId = req.params.clubId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  Activity.find({
    $and: [{ club: clubId }, { title: { $regex: searchValue } }],
  })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.searchCollaborators = (req, res) => {
  const activityId = req.params.activityId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  Activity.findById(activityId)
    .then((result) => {
      User.find({
        $and: [
          { _id: { $in: result.collaborators } },
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
        .then((collaborators) => {
          res.status(200).send(collaborators);
        })
        .catch((err) => {
          res.status(500).send({ error: "User query err - " + err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: "Activity query err - " + err.message });
    });
};

module.exports.searchUsersNotCollaborators = (req, res) => {
  const activityId = req.params.activityId;
  const encodedSearchValue = req.params.searchValue;
  const buff = Buffer.from(encodedSearchValue, "base64");
  const searchValue = buff.toString("utf8");

  Activity.findById(activityId)
    .populate("club")
    .then((result) => {
      User.find({
        $and: [
          { _id: { $nin: result.club.members } },
          { _id: { $nin: result.collaborators } },
          { _id: { $nin: [result.club.leader, result.club.treasurer] } },
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
          res.status(200).send(users);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.update = (req, res) => {
  const activityId = req.params.activityId;
  const { title, startDate, endDate } = req.body;

  Activity.updateOne(
    { _id: activityId },
    {
      title,
      startDate,
      endDate,
    }
  )
    .then(() => {
      Activity.findById(activityId)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ error: "Activity result err - " + err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: "Activity update err - " + err.message });
    });
};

module.exports.updateBoards = (req, res) => {
  const activityId = req.params.activityId;
  const { boards } = req.body;

  Activity.updateOne({ _id: activityId }, { boards })
    .then(() => {
      Activity.findById(activityId).then((result) => {
        async.forEach(
          result.boards,
          function (item, callback) {
            ActivityCard.populate(
              item,
              { path: "cards" },
              function (err, output) {
                if (err) {
                  res.status(500).send({ error: err.message });
                  return;
                }
                callback();
              }
            );
          },
          function (err) {
            if (err) {
              res.status(500).send({ error: err.message });
              return;
            }
            res.status(200).send(result);
          }
        );
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

module.exports.updateColumn = async (req, res) => {
  const activityId = req.params.activityId;
  const { column, card } = req.body;
  //console.log(column, typeof card)

  Activity.findById(activityId, async function (err, doc) {
    if (err) {
      res.status(500).send({ error: "Loading err - " + err.message });
      return;
    }

    if (card === null) {
      for (let i = 0; i < doc.boards.length; i++) {
        if (doc.boards[i]._id.toString() === column._id) {
          doc.boards[i].cards = column.cards;
        }
      }
    } else {
      doc.boards.forEach((col) => {
        if (col._id.toString() === column._id) {
          col.cards = column.cards;
        } else {
          var newCards = col.cards.filter(function (value, index, arr) {
            return value._id.toString() !== card._id;
          });
          col.cards = newCards;
        }
      });
    }

    doc
      .save()
      .then((result) => {
        async.forEach(
          result.boards,
          function (item, callback) {
            ActivityCard.populate(
              item,
              { path: "cards" },
              function (err, output) {
                if (err) {
                  res
                    .status(500)
                    .send({ error: "Populate err - " + err.message });
                  return;
                }
                callback();
              }
            );
          },
          function (err) {
            if (err) {
              res
                .status(500)
                .send({ error: "Populate complete err - " + err.message });
              return;
            }
            res.status(200).send(result);
          }
        );
      })
      .catch((err) => {
        res.status(500).send({ error: "Save err - " + err.message });
      });
  });
};

module.exports.updateCollaborators = (req, res) => {
  const activityId = req.params.activityId;
  const { collaborators } = req.body;

  Activity.updateOne(
    { _id: activityId },
    { $pull: { collaborators: { $in: collaborators } } }
  )
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).send({ error: "Activity update err - " + err.message });
    });
};

module.exports.addCollaborators = (req, res) => {
  const activityId = req.params.activityId;
  const { users } = req.body;

  Activity.updateOne(
    { _id: activityId },
    { $push: { collaborators: { $each: users } } }
  )
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).send({ error: "Activity update err - " + err.message });
    });
};

module.exports.deleteAllCards = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const { columnId } = req.body;

    let activity = await Activity.findById(activityId);
    let listCardId = [];
    activity.boards.forEach((column) => {
      if (column._id.toString() === columnId) {
        listCardId = JSON.parse(JSON.stringify(column.cards));
        column.cards = [];
      }
    });

    async.forEach(
      listCardId,
      async function (item, callback) {
        let card = await ActivityCard.findById(item);

        card.remove().then(() => {
          if (typeof callback === "function") {
            return callback();
          }
        });
      },
      function (err) {
        if (err) {
          res.status(500).send({ error: "Card deleted err - " + err.message });
          return;
        }
        activity.save().then((result) => {
          async.forEach(
            result.boards,
            function (item, callback) {
              ActivityCard.populate(
                item,
                { path: "cards" },
                function (err, output) {
                  if (err) {
                    res.status(500).send({ error: err.message });
                    return;
                  }
                  callback();
                }
              );
            },
            function (err) {
              if (err) {
                res.status(500).send({ error: err.message });
                return;
              }
              res.status(200).send(result);
            }
          );
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.sumary = async (req, res) => {
  const activityId = req.params.activityId;
  const { sumary, author } = req.body;
  try {
    let activity = await Activity.findById(activityId).populate("club");
    if (activity === undefined || activity === null) {
      res.status(404).send({ error: "Không tìm thấy hoạt động này." });
      return;
    }

    activity.sumary = sumary
    const members = activity.club.members;
    members.push(activity.club.leader);
    members.push(activity.club.treasurer);
    const column = activity.boards.find((col) => {
      return col.title === "Đã xong";
    });

    const cardIds = column.cards;
    const cards = await ActivityCard.find({ _id: { $in: cardIds } }).populate(
      "groupJoin"
    );

    const allMembersInCards = getAllMembersInCards(cards, members);
    const allCollaboratorsInCards = getAllCollaboratorsInCards(
      cards,
      activity.collaborators
    );
    // console.log(allMembersInCards)
    // console.log(allCollaboratorsInCards)

    // handle joinpoint
    if (activity.joinPoint > 0) {
      let joinPointArr = [];
      let joinPointActivityArr = []
      activity.collaborators.map(async (uid) => {
        const point = {
          title: `${activity.title}(${moment(activity.startDate).format(
            "DD/MM/YYYY"
          )}-${moment(activity.endDate).format("DD/MM/YYYY")}) - Điểm tham gia`,
          club: activity.club._id,
          activity: activity._id,
          value: activity.joinPoint,
          author: author,
          user: uid,
        };
        joinPointActivityArr.push(point);
      });
      allMembersInCards.map(async (obj) => {
        const point = {
            title: `${activity.title}(${moment(activity.startDate).format(
              "DD/MM/YYYY"
            )}-${moment(activity.endDate).format("DD/MM/YYYY")}) - Điểm tham gia`,
            club: activity.club._id,
            activity: activity._id,
            value: activity.joinPoint,
            author: author,
            user: obj._id,
          };
          joinPointArr.push(point);
          joinPointActivityArr.push(point);
      })
      await Point.insertMany(joinPointArr);
      await ActivityPoint.insertMany(joinPointActivityArr);
    }

    // handle calculate point by config
    const countCards = cardIds.length;
    let pointArr = [];
    let activityPointArr = [];
    let milestoneArr = JSON.parse(JSON.stringify(activity.configMilestone))
    milestoneArr = milestoneArr.sort((a, b) => b.percentOrQuantity - a.percentOrQuantity);
    // console.log(activity.configMilestone)
    // console.log(milestoneArr)
    if (activity.configType === "percent") {
      allCollaboratorsInCards.map(async (obj) => {
        for (let i = 0; i < milestoneArr.length; i++) {
          const percent = (obj.count / countCards) * 100;
          if (percent >= milestoneArr[i].percentOrQuantity) {
            // console.log(obj._id, percent + ">=" + milestoneArr[i].percentOrQuantity)
            const point = {
              title: `${activity.title}(${moment(activity.startDate).format(
                "DD/MM/YYYY"
              )}-${moment(activity.endDate).format(
                "DD/MM/YYYY"
              )}) - Điểm hoàn thành ${milestoneArr[i].percentOrQuantity}%`,
              activity: activity._id,
              value: milestoneArr[i].point,
              author: author,
              user: obj._id,
            };
            activityPointArr.push(point);
            break;
          }
        }
      });

      allMembersInCards.map(async (obj) => {
        for (let i = 0; i < milestoneArr.length; i++) {
          const percent = (obj.count / countCards) * 100;
          if (percent >= milestoneArr[i].percentOrQuantity) {
            const point = {
              title: `${activity.title}(${moment(activity.startDate).format(
                "DD/MM/YYYY"
              )}-${moment(activity.endDate).format(
                "DD/MM/YYYY"
              )}) - Điểm hoàn thành ${milestoneArr[i].percentOrQuantity}%`,
              club: activity.club._id,
              activity: activity._id,
              value: milestoneArr[i].point,
              author: author,
              user: obj._id,
            };
            pointArr.push(point);
            activityPointArr.push(point);
            break;
          }
        }
      });
    } else if (activity.configType === "quantity") {
      allCollaboratorsInCards.map(async (obj) => {
        for (let i = 0; i < milestoneArr.length; i++) {
          if (obj.count >= milestoneArr[i].percentOrQuantity) {
            // console.log(obj._id, percent + ">=" + milestoneArr[i].percentOrQuantity)
            const point = {
              title: `${activity.title}(${moment(activity.startDate).format(
                "DD/MM/YYYY"
              )}-${moment(activity.endDate).format(
                "DD/MM/YYYY"
              )}) - Điểm hoàn thành ${milestoneArr[i].percentOrQuantity}/${
                countCards
              } thẻ`,
              activity: activity._id,
              value: milestoneArr[i].point,
              author: author,
              user: obj._id,
            };
            activityPointArr.push(point);
            break;
          }
        }
      });
      allMembersInCards.map(async (obj) => {
        for (let i = 0; i < milestoneArr.length; i++) {
          if (obj.count >= milestoneArr[i].percentOrQuantity) {
            const point = {
              title: `${activity.title}(${moment(activity.startDate).format(
                "DD/MM/YYYY"
              )}-${moment(activity.endDate).format(
                "DD/MM/YYYY"
              )}) - Điểm hoàn thành ${milestoneArr[i].percentOrQuantity}/${
                countCards
              } thẻ`,
              club: activity.club._id,
              activity: activity._id,
              value: milestoneArr[i].point,
              author: author,
              user: obj._id,
            };
            pointArr.push(point);
            activityPointArr.push(point);
            break;
          }
        }
      });
    }

    // console.log("POINT ARR", pointArr);
    // console.log("ACTIVITY POINT ARR", activityPointArr);
    const points = await Point.insertMany(pointArr)
    const activityPoints = await ActivityPoint.insertMany(activityPointArr)
    const saveActivity = await activity.save()
    res.status(200).send(saveActivity);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.config = async (req, res) => {
  const activityId = req.params.activityId;
  const { joinPoint, configType, configMilestone } = req.body;
  try {
    let activity = await Activity.findById(activityId).populate("club");
    if (activity === undefined || activity === null) {
      res.status(404).send({ error: "Không tìm thấy hoạt động này." });
      return;
    }
    activity.joinPoint = joinPoint;
    activity.configType = configType;
    activity.configMilestone = configMilestone;
    const saveActivity = await activity.save();
    res.status(200).send(saveActivity);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    let activity = await Activity.findById(activityId);
    const boards = activity.boards;
    const mergeCards = boards[0].cards.concat(
      boards[1].cards,
      boards[2].cards,
      boards[3].cards
    );
    //console.log(mergeCards)
    async.forEach(
      mergeCards,
      async function (item, callback) {
        let card = await ActivityCard.findById(item);

        card.remove().then(() => {
          if (typeof callback === "function") {
            return callback();
          }
        });
      },
      function (err) {
        if (err) {
          res.status(500).send({ error: "Card deleted err - " + err.message });
          return;
        }
        activity.remove().then(() => {
          res.status(200).send(activity);
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//card
module.exports.userJoin = (req, res) => {
  const { userId, cardId } = req.body;

  ActivityCard.findById(cardId)
    .populate("groupJoin")
    .then((card) => {
      // if (card.status === 0 || card.status === 2) {
      //     res.status(400).send({ error: "Thẻ này chưa mở check-in.", success: false });
      //     return;
      // }
      //check user joined?
      if (isUserJoined(userId, card)) {
        res.status(200).send({ message: "Bạn đã tham gia", success: false });
      } else {
        ActivityCard.updateOne({ _id: cardId }, { $push: { userJoin: userId } })
          .then(() => {
            res
              .status(200)
              .send({ message: "Tham gia thành công!", success: true });
          })
          .catch((err) => {
            res.status(500).json({ error: "Update card err - " + err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Query card err - " + err.message });
    });
};

module.exports.groupJoin = (req, res) => {
  const { groupId, cardId } = req.body;

  ActivityCard.findById(cardId)
    .populate("groupJoin")
    .then((card) => {
      if (card.status === 0 || card.status === 2) {
        res
          .status(400)
          .send({ message: "Thẻ này chưa mở check-in.", success: false });
        return;
      }
      if (isGroupJoined(groupId, card)) {
        res.status(200).send({ message: "Nhóm đã tham gia", success: false });
      } else {
        ActivityCard.updateOne(
          { _id: cardId },
          { $push: { groupJoin: groupId } }
        )
          .then(() => {
            res
              .status(200)
              .send({ message: "Nhóm tham gia thành công!", success: true });
          })
          .catch((err) => {
            res.status(500).json({ error: "Update card err - " + err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Query card err - " + err.message });
    });
};

module.exports.upload = async (req, res) => {
  const files = req.files;
  const { cardId } = req.body;

  const uploadData = await uploadFile(files, "");
  //console.log(uploadData)
  ActivityCard.updateOne({ _id: cardId }, { $push: { files: uploadData } })
    .then(() => {
      ActivityCard.findById(cardId)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(500).json({ error: "Result err - " + err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Update card err - " + err.message });
    });
};

module.exports.addComment = async (req, res) => {
  try {
    const { cardId, content, author } = req.body;
    let now = Date.now();
    //console.log(cardId, content, author)

    let card = await ActivityCard.findById(cardId);
    const comment = {
      content,
      createdAt: now,
      author,
    };

    card.comments.push(comment);

    card.save().then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getCard = (req, res) => {
  const cardId = req.params.cardId;

  ActivityCard.findById(cardId)
    .populate("userJoin")
    .populate("groupJoin")
    .then((result) => {
      async.forEach(
        result.comments,
        function (item, callback) {
          User.populate(item, { path: "author" }, function (err, output) {
            if (err) {
              res.status(500).send({ error: err.message });
              return;
            }
            callback();
          });
        },
        function (err) {
          if (err) {
            res.status(500).send({ error: err.message });
            return;
          }
          async.forEach(
            result.groupJoin,
            function (group, next) {
              User.populate(group, { path: "members" }, function (error, out) {
                if (error) {
                  res.status(500).send({ error: error.message });
                  return;
                }
                next();
              });
            },
            function (err) {
              if (err) {
                res.status(500).send({ error: err.message });
                return;
              }
              res.status(200).send(result);
            }
          );
        }
      );
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.userExitCard = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { userId } = req.body;
    let card = await ActivityCard.findById(cardId);

    const newUserJoin = card.userJoin.filter(
      (uid) => uid.toString() !== userId
    );

    card.userJoin = newUserJoin;

    card.save().then((result) => {
      res
        .status(200)
        .send({ message: "Xóa khỏi thẻ thành công!", success: true });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.groupExitCard = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { groupId } = req.body;
    let card = await ActivityCard.findById(cardId);

    const newGroupJoin = card.groupJoin.filter(
      (gid) => gid.toString() !== groupId
    );

    card.groupJoin = newGroupJoin;

    card.save().then((result) => {
      res
        .status(200)
        .send({ message: "Xóa khỏi thẻ thành công!", success: true });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateCardDescription = (req, res) => {
  const cardId = req.params.cardId;
  const { description } = req.body;

  ActivityCard.updateOne({ _id: cardId }, { description })
    .then(() => {
      ActivityCard.findById(cardId)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(500).json({ error: "Result err - " + err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Update card err - " + err.message });
    });
};

module.exports.deleteComment = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { commentId } = req.body;
    let card = await ActivityCard.findById(cardId);

    const newComments = card.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    card.comments = newComments;

    card.save().then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteFile = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { public_id } = req.body;
    await cloudinary.uploader.destroy(public_id, function (result) {
      console.log("destroy image", result);
    });

    let card = await ActivityCard.findById(cardId);

    const newFiles = card.files.filter((file) => file.public_id !== public_id);

    card.files = newFiles;

    card.save().then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updatePoint = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { point } = req.body;
    let card = await ActivityCard.findById(cardId);
    card.pointValue = point;
    const saveCard = await card.save();
    res.status(200).send(saveCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    let card = await ActivityCard.findById(cardId);

    Activity.findById(card.activity, function (error, activity) {
      if (error) {
        res.status(500).json({ error: error.message });
      }
      activity.boards.forEach((column) => {
        if (isElementInArray(card._id, column.cards)) {
          var newCards = column.cards.filter(
            (c) => c.toString() !== card._id.toString()
          );
          column.cards = newCards;
        }
      });
      activity.save().then(() => {
        card.remove().then(() => {
          res.status(200).send({ message: "remove success", data: card });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
