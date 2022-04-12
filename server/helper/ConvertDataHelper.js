function ConvertClub(data) {
    let club = {}

    club._id = data._id;
    club.name = data.name;
    club.img_url = data.img_url;
    club.cloudinary_id = data.cloudinary_id;
    club.description = data.description;
    club.isblocked = data.isblocked;
    club.fund = data.fund;
    club.leader = {
        _id: data.leader._id,
        name: data.leader.name,
    };
    club.treasurer = {
        _id: data.treasurer._id,
        name: data.treasurer.name,
    };
    //Relation field
    club.members_num = 2; // + ...

    return club;
}

function ConvertClubs(data) {
    let clubs = []

    data.forEach(elm => {
        let club = {}

        club._id = elm._id;
        club.name = elm.name;
        club.img_url = elm.img_url;
        club.cloudinary_id = elm.cloudinary_id;
        club.description = elm.description;
        club.isblocked = elm.isblocked;
        club.fund = elm.fund;
        club.leader = {
            _id: elm.leader._id,
            name: elm.leader.name,
        };
        club.treasurer = {
            _id: elm.treasurer._id,
            name: elm.treasurer.name,
        };
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
        user.cloudinary_id = elm.cloudinary_id;
        user.email = elm.email;
        user.isblocked = elm.isblocked;
        //user.groups_num = elm.clubs.length;

        users.push(user)
    });

    return users;
}

module.exports = { ConvertClub, ConvertClubs, ConvertUsers }