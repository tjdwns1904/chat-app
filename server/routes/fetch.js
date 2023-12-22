const express = require('express');
const router = express.Router();
const fetchController = require('../controllers/fetchController');

router.post("/allUsers", fetchController.getUsers);
router.post("/allFriends", fetchController.getFriends);
router.post("/allRooms", fetchController.getRooms);
router.post("/room", fetchController.getRoom);

module.exports = router;