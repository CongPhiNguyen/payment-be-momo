const express = require('express');
const router = express.Router();

const momo = require('../app/controllers/momo.controller');
router.post("/", momo.payment); 
module.exports = router;