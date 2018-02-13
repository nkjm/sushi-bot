"use strict";

require("dotenv").config();

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const debug = require("debug")("bot-express:route");
const line_event = require("../service/line-event");
const { ActionsSdkApp } = require('actions-on-google');

router.post('/', (req, res, next) => {
    debug(req.headers);
    const app = new ActionsSdkApp({
        request: req,
        response: res
    });
    app.tell("こんにちは。ご用は？");
});

module.exports = router;
