const express=require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');

router.get('/users', userController.profile);

module.exports=router;
