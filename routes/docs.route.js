const express = require('express');
const router = new express.Router();
const path = require('path');



router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});



router.get('/', async (req, res, next) => {
    let options = {
        root: path.resolve(__dirname, '../')
    };
  let fileName = "/docs/index.html";
//   options.auth = req.body;

  try {
    // const result = await auth.postLogIn(options);
    res.status(200).sendFile(fileName, options, function (err) {
        if (err) {
        next(err)
    }
});
  }
  catch (err) {
    console.log(__dirname);
    return res.status(500).send({
      error: err || 'Something went wrong.'
    });
  }
});


router.get('/:fileName', async (req, res, next) => {
    let options = {
        dotfiles: 'deny',
        root: path.resolve(__dirname, '../')
      };
      let fileName = req.params.fileName

    try {
        // const result = await auth.postLogIn(options);
        res.status(200).sendFile('docs/' + fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName)
            }
        });
        // res.status(200).send({"test":"test"});
    }
    catch (err) {
        console.log(__dirname);
        return res.status(500).send({
            error: err || 'Something went wrong.'
        });
    }
});


module.exports = router;