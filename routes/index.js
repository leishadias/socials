const express=require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/users', require('./users'));
router.get('/post', require('./post'));

module.exports=router;
