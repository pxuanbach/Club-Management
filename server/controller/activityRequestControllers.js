const ActivityRequest = require('../models/ActivityRequest')
const User = require('../models/User')

function add_filter(reqQuery) {
    const { type, status, activity, user } = reqQuery
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
        query = {...query, status: { $in: status } }
      } else {
        query = { ...query, status: status }
      }
    }
    if (activity !== undefined) {
      if (Array.isArray(activity)) {
        query = {...query, activity: { $in: activity } }
      } else {
        query = { ...query, activity: activity }
      }
    }
    if (user !== undefined) {
      if (Array.isArray(user)) {
        query = {...query, user: { $in: user } }
      } else {
        query = { ...query, user: user }
      }
    }
    return query
  }

module.exports.getList = (req, res) => {
    const query = add_filter(req.query)
    ActivityRequest.find(query)
        .populate('sender')
        .populate('activity')
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
    const { sender, activity, user, type, club } = req.body;
    try {
        const userExist = await User.findById(user)
        if (userExist.username.includes("admin")) {
            res.status(400).send({ error: "Không thể yêu cầu tham gia." });
            return
        }
        const activityRequest = new ActivityRequest({ sender, activity, user, type, club });
        let saveActivityRequest = await activityRequest.save()
        res.status(200).send(saveActivityRequest)
    } catch (err) {
        console.log("ActivityRequest Create", err.message)
        res.status(500).send({ error: err.message});
    }
};


module.exports.updateStatus = async (req, res) => {
    const requestId = req.params.requestId;
    const { status } = req.body;
    console.log("updateStatus", status)
    ActivityRequest.findById(requestId, async function (err, doc) {
      if (err) {
        res.status(400).send({ error: err.message });
        return;
      }
      doc.status = status;
      if (status === 1) {
        // Accept
        
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