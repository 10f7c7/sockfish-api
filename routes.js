module.exports = function (app) {
  /*
  * Routes
  */
  app.use('/users', require('./routes/users.route'));
  app.use('/counselor', require('./routes/counselor.route')); 
  app.use('/auth', require('./routes/auth.route'));
  app.use('/crisis', require('./routes/crisis.route'));

};
