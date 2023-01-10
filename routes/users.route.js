const express = require('express');
const users = require('../services/users');
const router = new express.Router();
 
router.get('/:userId', async (req, res, next) => {
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

router.post('/:userId', async (req, res, next) => {
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

router.get('/:userId/hall_passes', async (req, res, next) => {
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

router.post('/:userId/hall_passes', async (req, res, next) => {
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