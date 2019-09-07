const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config({path: __dirname + '\\' + '.env'});

const { sequelize } = require('./models');
const { mongoose }  = require('./models_mg');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
// app.use(cors({ origin: 'https://www.chameleon4switch.cf' }));
app.use(cors());

// use database with sequelize
sequelize.sync();

// configure api router
app.use('/api', require('./routes/api'));

/** PORT LISTENING */
app.listen(4000, () => {
    console.log('Express가 4000번 포트에서 리스닝 중이라네!');
});

