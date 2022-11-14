let express = require("express");
let router  = express.Router();
let userActionsController = require("../controllers/user_actions.controller");

router.post("/post", userActionsController.post);

router.post("/delete_post", userActionsController.deletePost);


module.exports = router;