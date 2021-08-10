const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/jwt'); 


const authRouter = require('./common/auth');




router.use('/auth', authRouter);

module.exports = router;