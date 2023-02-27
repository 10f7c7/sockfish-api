const express = require('express');
const crisis = require('../services/crisis');
const { authJwt } = require("../middleware");
const router = new express.Router();

router.post('/create_crisis', async (req, res, next) => {
  let options = {
  };

  options.crisisItem = req.body;

  try {
    const result = await crisis.createCrisis(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      error: err || 'Something went wrong.'
    });
  }
});
 
router.get('/get_crises', async (req, res, next) => {
  let options = {
    "getResolved": req.query.getResolved,
    "getAll": req.query.getAll
  };


  try {
    const result = await crisis.getCrises(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      error: err || 'Something went wrong.'
    });
  }
});
 
router.get('/get_crises/users/:userId', async (req, res, next) => {
  let options = { 
    "userId": req.params.userId,
    "getResolved": req.query.getResolved,
    "getAll": req.query.getAll
  };


  try {
    const result = await crisis.getCrisesById(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      error: err || 'Something went wrong.'
    });
  }
});

module.exports = router;