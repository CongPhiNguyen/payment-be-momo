const express = require('express');
const router = express.Router();

const ship = require('../app/controllers/ship.controller');
router.post("/", ship.shipment); 
module.exports = router;
