const express = require('express');
const router = express.Router();

const email = require('../app/controllers/email.controller');

router.post('/', email.sendMail) 
//body:
// recivers: list of recivers
// subject: subject
// content: content
// attachments: attachments: [{filename(optional), path: file in assets}]
module.exports = router;