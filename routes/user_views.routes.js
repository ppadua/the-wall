let express = require("express");
let router  = express.Router();
let userViewsController = require("../controllers/user_views.controller");

router.get("/", userViewsController.homepage);
router.get("/dashboard", userViewsController.dashboard);

module.exports = router;