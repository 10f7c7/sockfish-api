const express = require('express'),
    https = require('https'),
    fs = require('fs'),
    cookieParser = require('cookie-parser'),
    log = require('morgan'),
    path = require('path'),
    cors = require('cors'),
    multer = require('multer'),
    upload = multer(),
    app = express(),
    router = express.Router(),
    errorHandler = require('errorhandler'),
    YAML = require('yaml'),
    swaggerUi = require('swagger-ui-express'),
    PORT = process.env.PORT || 3000,
    NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config();
app.set('port', PORT);
app.set('env', NODE_ENV);

 var options = {
   key: fs.readFileSync(path.join(__dirname, process.env.ABS_SSLKEY_PATH)),
   cert: fs.readFileSync(path.join(__dirname, process.env.ABS_SSLCERT_PATH)),
   ca: fs.readFileSync(path.join(__dirname, process.env.ABS_SSLCA_PATH))
};
const swaggerDocument = YAML.parse(fs.readFileSync('./docs/index.yaml', 'utf8'))

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use(log('tiny'));

// parse application/json
router.use(express.json());

// parse raw text
router.use(express.text());

// parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

// parse multipart/form-data
router.use(upload.array());
router.use(express.static('public'));

router.use(cookieParser());


require('./routes')(router);

// catch 404
router.use((req, res, next) => {
    // log.error(`Error 404 on ${req.url}.`);
    res.status(404).send({ status: 404, error: 'Not found' });
});


if (process.env.NODE_ENV === "development") {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }))
  };
  
  if (process.env.NODE_ENV === "production") {
    app.use(errorHandler())
  };


// catch errors
router.use((err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.error || err.message;
    // log.error(`Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${req.body}.`);
    res.status(status).send({ status, error: msg });
});

module.exports = app;

app.use('/api/v1', router);

var server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(
        `Express Server started on Port ${app.get(
            'port'
        )} | Environment : ${app.get('env')}`
    );
});
