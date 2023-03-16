const express = require('express');
const counselor = require('../services/counselor');
const router = new express.Router();
const { authJwt } = require("../middleware");


router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});


router.post('/create_appointment', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
    };

    options.appointment = req.body;

    try {
        const result = await counselor.createAppointment(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.get('/get_counselor/:counselorId', async (req, res, next) => {
    let options = {
        "counselorId": req.params.counselorId,
        "isAvailable": req.query.isAvailable,
    };


    try {
        const result = await counselor.getCounselors(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.get('/get_counselor', async (req, res, next) => {
    let options = {
        "counselorId": false,
        "isAvailable": req.query.isAvailable,
    };


    try {
        const result = await counselor.getCounselors(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.get('/get_occupied', async (req, res, next) => {
    let options = {
        "date": req.query.date,
        "counselorId": req.query.counselorId,
        "timesOnly": req.query.timesOnly,
    };


    try {
        const result = await counselor.getOccupied(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.post('/toggle_walkin', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
    };

    options.toggleWalkin = req.body;

    try {
        const result = await counselor.toggleWalkin(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

module.exports = router;
