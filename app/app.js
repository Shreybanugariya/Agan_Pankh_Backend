const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const routes = require('../app/routes');
const cron = require('node-cron');
const TestSession = require('./tests/testSession.model')
const { submitTestAndCalulateResult } = require('./common/functions')

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Verification', 'x-forwarded-for'],
    exposedHeaders: ['Authorization', 'Verification', 'x-forwarded-for'],
};

const routeConfig = (req, res, next) => {
    req.sRemoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.platform = req.headers.platform;
    if (req.path === '/ping') return res.status(200).send({ mode: process.env.NODE_ENV });
    res.reply = ({ code, prefix, message }, data = {}, header = undefined) => {
        if (prefix) {
            message = prefix + message;
        }
        return res.status(code).header(header).json({ message, data });
    };
    next();
};

const routeHandler = function (req, res) {
    res.status(404);
    res.send({ message: 'Route not found' });
};

const logErrors = function (err, req, res, next) {
    console.error(`${req.method} ${req.url}p`);
    console.error('body -> ', req.body);
    console.error(err.stack);
    return next(err);
};

const errorHandler = function (err, req, res, next) {
    res.status(500);
    res.send({ message: err });
};

app.disable('etag');
app.disable('x-powered-by');
app.enable('trust proxy');
app.set('view engine', 'ejs');
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.urlencoded({ limit: '16mb', extended: true, parameterLimit: 50000 }));
app.use(morgan('dev', { skip: (req) => req.path === '/ping' || req.path === '/favicon.ico' }));
app.use(routeConfig);
app.use('/api/v1', routes);
app.use('*', routeHandler);
app.use(logErrors);
app.use(errorHandler);

const httpServer = http.createServer(app);

httpServer.timeout = 10000;
httpServer.listen(process.env.PORT, '0.0.0.0', () => console.green(`Spinning on ${process.env.PORT}`));

//Cron

cron.schedule('* * * * *', async () => {
    try {
      const currentTime = new Date();
      const expiredSessions = await TestSession.find({ endTime: { $lte: currentTime } });
  
      for (const session of expiredSessions) {
        const { userId, testId } = session
        await submitTestAndCalulateResult({ userId, testId });
        await TestSession.findByIdAndDelete(session._id);
      }
    } catch (error) {
      console.error('Error processing cron job:', error);
    }
});

module.exports = httpServer;
