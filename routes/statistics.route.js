const express = require('express');
const statistics = require('../services/statistics');
const router = new express.Router();
const path = require('path');

router.get('/appointment', async (req, res, next) => {
  let options = {
    root: path.resolve(__dirname, '../svg')
  };


  try {
    const result = await statistics.statisticsAppointment();
    console.log(result.data);
    res.status(result.status || 200).sendFile(result.data, options, function (err) {
      if (err) {
        next(err)
      }
    });
  }
  catch (err) {
    return res.status(500).send({
      error: err || 'Something went wrong.'
    });
  }
});

router.get('/urgancy', async (req, res, next) => {
  let options = {
    root: path.resolve(__dirname, '../svg')
  };


  try {
    const result = await statistics.statisticsUrgancy(options);
    console.log(result.data);
    res.status(result.status || 200).sendFile(result.data, options, function (err) {
      if (err) {
        next(err)
      }
    });
  }
  catch (err) {
    return res.status(500).send({
      error: err || 'Something went wrong.'
    });
  }
});

module.exports = router;