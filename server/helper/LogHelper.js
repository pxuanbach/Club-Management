const ClubLog = require('../models/ClubLog')


/**
 * Save log to database.
 * 
 * @param {string} club The _id of club.
 * @param {string} type "member_join", "member_out", "activity_started", "activity_ended", etc...
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

module.exports = { saveLog }