"use strict";

require("dotenv").config();

const express = require('express');
const router = express.Router();
const request = require("request");
const debug = require("debug")("bot-express:route");
const line_event = require("../service/line-event");
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

Promise = require("bluebird");
Promise.promisifyAll(request);

router.post('/', (req, res, next) => {
    const app = new ActionsSdkApp({request: req, response: res});

    let actionMap = new Map();
    actionMap.set(app.StandardIntents.MAIN, mainIntent);

    app.handleRequest(actionMap);
});

function mainIntent(app){
    app.tell("いろは");
}

module.exports = router;
