const express = require("express");
const router = express.Router(); //using the router function
const auth = require("../middleware/auth"); // auth middleware
const multer = require("../middleware/config-avatar"); //multer

const user = require("../controllers/user"); //path to the right controller

router.post("/signup", multer, user.create_an_account);

router.post("/login", user.connect_to_account);

router.get("/getone", auth, user.get_user_infos);

router.post("/changeavatar", auth, multer, user.change_avatar);

router.delete("/deleteaccount", auth, user.delete_the_account);

module.exports = router;
