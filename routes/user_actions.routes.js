let express = require("express");
let router  = express.Router();
let userActionController = require("../controllers/user_actions.controller");


router.post("/create_post", userActionController.create_post);
router.post("/delete_post", userActionController.delete_post);


module.exports = router;