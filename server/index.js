const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const scheduler = require('./scheduler/index')

//Routes
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const fundRoutes = require("./routes/fundRoutes");
const activityRoutes = require("./routes/activityRoutes");
const schedulerRoutes = require("./routes/schedulerRoutes");
const exportRoutes = require("./routes/exportRoutes");
const requestRoutes = require("./routes/requestRoutes");
const logRoutes = require("./routes/logRoutes");
const pointRoutes = require("./routes/pointRoutes");
const staticRoutes = require('./routes/statisticRoutes');

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
console.log("🚀 ~ ALLOWED_ORIGINS:", ALLOWED_ORIGINS)

const corsOptions = {
    origin: ALLOWED_ORIGINS,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
};

const http = require("http").createServer(app);
const mongoose = require("mongoose");
const socketio = require("socket.io");
const io = socketio(http);
const dotenv = require("dotenv");
dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    var m = new Date();
    var dateString =
        m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);
    console.log(dateString, '- Method:', req.method, '-', req.path, '-', res.statusCode);
    next();
 })

app.get("/", (req, res) => {
    res.status(200).json({health: "ok"})
})

//use route
app.use(authRoutes);
app.use(uploadRoutes);
app.use("/club", clubRoutes);
app.use("/user", userRoutes);
app.use("/group", groupRoutes);
app.use("/fund", fundRoutes);
app.use("/activity", activityRoutes);
app.use("/scheduler", schedulerRoutes);
app.use("/export", exportRoutes);
app.use("/request", requestRoutes);
app.use("/log", logRoutes);
app.use("/point", pointRoutes);
app.use("/statistic", staticRoutes);
// mongodb://root:PassW0rd@host.docker.internal:27016/club_management?authSource=admin
//Connect DB
mongoose
    .connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/?authSource=admin`,{
        user: process.env.MONGODB_USERNAME,
        pass: process.env.MONGODB_PASSWORD,
        dbName: process.env.MONGODB_DBNAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("🍃 MongoDB connected"))
    .catch((err) => console.log(err));


const PORT = process.env.PORT || 5000;
const { addUser, removeUser } = require("./helper/ChatRoomHelper");

io.on("connection", (socket) => {
    console.log("🚀 ~ file: index.js:78 ~ io.on ~ socket.id:", socket.id)
    require("./controller/chatRoomControllers")(socket, io);

    socket.on("disconnecting", () => {
        // const user = removeUser(socket.id);
        // console.log('A user disconnected', user)
        //console.log("on disconnecting socket sids", socket.adapter.sids[socket.id])
        console.log("🛬 on disconnecting io", io.sockets.adapter.rooms);
    });

    socket.on("disconnect", () => {
        // const user = removeUser(socket.id);
        // console.log('A user disconnected', user)
        // console.log("on disconnect socket", socket.adapter.rooms)
        console.log("🛬 on disconnect io", io.sockets.adapter.rooms);
    });
});

scheduler.initScheduledJobs();

http.listen(PORT, () => {
    console.log(`🎉 Server is listening on port ${PORT}`);
});
