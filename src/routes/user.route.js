const express = require("express");
const router = express.Router();
const userController = require('../controller/user.controller');
const {verifyToken} = require("../middleware/verifyToken");

router.use(verifyToken);


router.get("/",userController.getUsers);
router.get("/profilePosts", userController.profilePosts);
router.get("/notification", userController.getNotificationNumber);
router.get("/:id",userController.getUser);
router.delete("/:id",userController.deleteUser);
router.put("/:id",userController.updateUser);
router.post("/save/:id",userController.savePost);

module.exports = router;