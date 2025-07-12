const express = require("express");
const router = express.Router();
const userController = require('../controller/user.controller');
const {verifyToken} = require("../middleware/verifyToken");

router.get("/",verifyToken,userController.getUsers);
router.get("/:id",verifyToken,userController.getUser);
router.delete("/:id",verifyToken,userController.deleteUser);
router.put("/:id",verifyToken,userController.updateUser);

module.exports = router;