const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const app = express();
const router = require('./routes');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    
    limits: { fileSize: 100 * 1024 * 1024 }
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

module.exports = app;