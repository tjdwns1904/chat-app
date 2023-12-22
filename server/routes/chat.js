const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post("/create", chatController.createChat);
router.post("/send", chatController.sendMsg);
router.post("/getChats", chatController.getChats);
router.post("/edit", chatController.editChat);
router.post("/invite", chatController.inviteFriend);
router.post("/leave", chatController.leaveChat);

module.exports = router;