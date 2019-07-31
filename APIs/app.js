const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path: __dirname + '\\' + '.env'});

const { sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

// use database with sequelize
sequelize.sync();

// configure api router
app.use('/api', require('./routes/api'));

/** PORT LISTENING */
app.listen(4000, () => {
    console.log('Express가 4000번 포트에서 리스닝 중이라네!');
});