const ClubLog = require('../models/ClubLog')


/**
 * Save log to database.
 * 
 * @param {string} club The _id of club.
 * @param {string} type "member_join", "member_out", "promote_leader", 
 * "promote_treasurer", "activity_started", "activity_ended", etc...
 * @param {string} content depend on type. Ex: "member_join" => The _id of user.
 * 
 * @return {ClubLog} The new ClubLog object.
 */
async function saveLog(club, type, content) {
    try {
        const clubLog = new ClubLog({ club, type, content });
        await clubLog.save()
        return clubLog
    } catch (err) {
        console.log("saveLog", err);
    }
}

/**
 * Delete all logs of club (by type).
 * 
 * @param {string} club The _id of club.
 * @param {(string|undefined)} [type] "member_join", "member_out", "promote_leader", 
 * "promote_treasurer", "activity_started", "activity_ended", etc...
 */
async function deleteLogOfClub(club, type) {
    try {
        query = { club: club }
        if (type !== undefined) {
            query = { ...query, type: type }
        }
        await ClubLog.deleteMany(query)
    } catch (err) {
        console.log("deleteLogByClub", err);
    }
}

/**
 * Delete all logs of user (by type).
 * 
 * @param {string} user The _id of user.
 * @param {(string|undefined)} [type] "member_join", "member_out", "promote_leader", 
 * "promote_treasurer", "activity_started", "activity_ended", etc...
 */
 async function deleteLogOfUser(user, type) {
    try {
        query = { user: user }
        if (type !== undefined) {
            query = { ...query, type: type }
        }
        await ClubLog.deleteMany(query)
    } catch (err) {
        console.log("deleteLogByClub", err);
    }
}


module.exports = { saveLog, deleteLogOfClub, deleteLogOfUser }