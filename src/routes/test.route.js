const express = require("express");
const router = express.Router();
const test = require("../controller/test.controller.js");
const { verifyToken } = require("../middleware/verifyToken.js");

// we used verifyToken to detect every time if the the JWT is good or not ! , if it's valid it should contenue to the next 
// which is test.shouldBeLoggedIn
router.get("/should-be-logged-in", verifyToken, test.shoudBeLoggedIn);
router.get("/should-be-admin", test.shouldBeAdmin);

module.exports = router;
