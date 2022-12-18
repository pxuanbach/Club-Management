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

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
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

//Connect DB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
const { addUser, removeUser } = require("./helper/ChatRoomHelper");

io.on("connection", (socket) => {
    console.log(socket.id);
    require("./controller/chatRoomControllers")(socket, io);

    socket.on("disconnecting", () => {
        // const user = removeUser(socket.id);
        // console.log('A user disconnected', user)
        //console.log("on disconnecting socket sids", socket.adapter.sids[socket.id])
        console.log("on disconnecting io", io.sockets.adapter.rooms);
    });

    socket.on("disconnect", () => {
        // const user = removeUser(socket.id);
        // console.log('A user disconnected', user)
        // console.log("on disconnect socket", socket.adapter.rooms)
        console.log("on disconnect io", io.sockets.adapter.rooms);
    });
});

scheduler.initScheduledJobs();

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
