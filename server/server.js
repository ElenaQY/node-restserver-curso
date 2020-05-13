const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('./config/config');

const app = express();
const puerto = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(puerto, () => console.log(`Escuchando el puerto: ${puerto}`));