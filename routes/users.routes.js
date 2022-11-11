let express = require("express");
let router  = express.Router();
let userController = require("../controllers/users.controller");


router.get("/", userController.homepage);
router.get("/dashboard", userController.dashboard);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/post", userController.savePostOrComment);
router.post("/delete_post_comment", userController.deletePostOrComment);
router.get("/logout", userController.logout);


module.exports = router;