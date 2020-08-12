const express = require('express');
const userController = require('../controllers/user.controllers');

const router = express.Router();

router.get('/', userController.findAll);

router.post('/', userController.create);

module.exports = router;

