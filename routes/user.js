const express = require("express"),
      UserController = require("../controllers/user")

const router = express.Router();

router.post("/signup", UserController.NewUser);

router.post("/login", UserController.userLogin);

module.exports = router;
