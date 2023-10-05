const User = require('./models/User');
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

async function initAdminUser() {
    await mongoose
        .connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/`,{
            user: process.env.MONGODB_USERNAME,
            pass: process.env.MONGODB_PASSWORD,
            dbName: process.env.MONGODB_DBNAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(async () => console.log("Connected"))
        .catch((err) => console.log(err));

    const now = new Date();
    console.log(`${now} - INITIALIZE FIRST ADMIN - start`);
    const user = await User.create({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        name: "Admin",
        email: "pxuanbach.dev@gmail.com"
    });

    await user.save();
    console.log(`${now} - INITIALIZE FIRST ADMIN - end`);
    await mongoose.disconnect();
}


initAdminUser();