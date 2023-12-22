const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/addFriend", userController.addFriend);
router.post("/deleteFriend", userController.deleteFriend);
router.post("/update", userController.editProfile);
router.post("/changepw", userController.changePassword);
router.post("/getUser", userController.getUser);

module.exports = router;