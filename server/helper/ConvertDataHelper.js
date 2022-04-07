const User = require('../models/User')

function ConvertClubs(data) {
    let clubs = []

    data.forEach(elm => {
        let club = {}

        club._id = elm._id;
        club.name = elm.name;
        club.img_url = elm.img_url;
        club.description = elm.description;
        club.isblocked = elm.isblocked;
        club.fund = elm.fund;
        club.leader = elm.leader.name;
        club.treasurer = elm.treasurer.name;
        //Relation field
        club.members_num = 2; // + ...
        
        clubs.push(club);
    })

    return clubs;
}

function ConvertUsers(data) {
    let users = []

    data.forEach(elm => {
        let user = {}

        user._id = elm._id;
        user.name = elm.name;
        user.username = elm.username;
        user.img_url = elm.img_url;
        user.email = elm.email;
        user.isblocked = elm.isblocked;
        user.groups_num = elm.groups.length;

        users.push(user)
    });

    return users;
}

module.exports = { ConvertClubs, ConvertUsers }