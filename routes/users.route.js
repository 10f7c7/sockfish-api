const express = require('express');
const users = require('../services/users');
const { authJwt } = require("../middleware");
const router = new express.Router();


router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});


router.get('/:userId', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
        "userId": req.params.userId,
    };


    try {
        const result = await users.getUserId(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.post('/:userId', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
        "userId": req.params.userId,
    };

    options.user = req.body;

    try {
        const result = await users.postUserId(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.get('/:userId/current_course', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
        "userId": req.params.userId,
    };


    try {
        const result = await users.getUserIdCurrentCourse(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});


router.get('/:userId/hall_passes', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
        "userId": req.params.userId,
    };


    try {
        const result = await users.getUserIdHallPasses(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.post('/:userId/hall_passes', [authJwt.verifyToken], async (req, res, next) => {
    let options = {
        "userId": req.params.userId,
    };

    options.HallPasses = req.body;

    try {
        const result = await users.postUserIdHallPasses(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

module.exports = router;