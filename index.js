const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
var cors = require('cors')
var fs = require('fs');
var bodyParser = require('body-parser');
var server;
var routes = require('./routes');

// const { Client } = require('pg');
// // connect to nlp-champs postgres ( on dell )
// const client = new Client({
//   user: process.env.NLP_CHAMPS_DB_USER,
//   host: process.env.NLP_CHAMPS_DB_HOST,
//   database: process.env.NLP_CHAMPS_DB,
//   password: process.env.NLP_CHAMPS_DB_PASSWORD,
//   port: process.env.NLP_CHAMPS_DB_PORT,
// });
// client.connect();

// CORS
app.use(cors());

// bodyParser to get posts from $.ajax
app.use(bodyParser.json());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// all routes of server (GET and POST)
app.use('/', routes);

// all POST routes

// listening ports - reverse proxyed from nginx nlp-champs.com
app.listen(3000);
