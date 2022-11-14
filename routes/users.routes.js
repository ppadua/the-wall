let express = require("express");
let router  = express.Router();
let userController = require("../controllers/users.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);


module.exports = router;