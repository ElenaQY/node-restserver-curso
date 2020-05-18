const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(`${__dirname}/../../uploads/${tipo}/${img}`);
    if (!fs.existsSync(pathImagen)) {
        pathImagen = path.resolve(`${__dirname}/../../server/assets/no-image.jpg`);
    };
    res.sendFile(pathImagen);
})

module.exports = app;