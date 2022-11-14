const Express = require('express');
const BodyParser = require('body-parser');
const Path = require('path');
const Session = require('express-session');
const App = Express();

App.use(BodyParser.json({limit: '50mb'}));
App.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
App.set("view engine", "ejs");
App.set('views', Path.join(__dirname, "/views"));
App.use('/assets', Express.static(Path.join(__dirname, "/assets")));
App.use(Session({
    secret: "wall",
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false }
}));

let userViewRouter = require("./routes/user_views.routes")
App.use("/", userViewRouter);

let userRouter = require("./routes/users.routes")
App.use("/users", userRouter);


App.listen(3000, () => {
    console.log(`Example app listening on port 3000, PID ${process.pid}`);
})