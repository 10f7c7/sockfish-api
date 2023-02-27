const express = require('express');
const auth = require('../services/auth');
const router = new express.Router();



router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});


router.post('/login', async (req, res, next) => {
    let options = {};

    options.auth = req.body;

    try {
        const result = await auth.postLogIn(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});

router.post('/signup', async (req, res, next) => {
    let options = {};

    options.auth = req.body;

    try {
        const result = await auth.postSignUp(options);
        res.status(result.status || 200).send(result.data);
    }
    catch (err) {
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});



module.exports = router;