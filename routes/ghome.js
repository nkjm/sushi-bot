"use strict";

require("dotenv").config();

const express = require('express');
const router = express.Router();
const request = require("request");
const debug = require("debug")("bot-express:route");
const line_event = require("../service/line-event");
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

router.post('/', (req, res, next) => {
    const app = new ActionsSdkApp({request: req, response: res});
    app.handleRequest(mainIntent);
});

function mainIntent(app){
    app.tell("いろは");
}

module.exports = router;
