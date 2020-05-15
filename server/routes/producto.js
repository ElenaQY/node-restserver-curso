const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();
let Producto = require('../models/producto');

//===========================================================
//  Mostrar todos los productos
//===========================================================
app.use('/productos', verificaToken, (req, res) => {

    const from = req.query.from || 0;
    const limit = req.query.limit || 100000;

    Producto.find({ disponible: true })
        .skip(Number(from))
        .limit(Number(limit))
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            Producto.count({ disponible: true }, (err, counter) => {
                res.json({
                    ok: true,
                    numero: counter,
                    from,
                    limit,
                    productos
                });
            });
        });
});

//===========================================================
//  Mostrar un producto por ID
//===========================================================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.find({ _id: id }, )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            };

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'prodcto no encontrado'
                    }
                });
            };

            Producto.count({ _id: id }, (err, counter) => {
                res.json({
                    ok: true,
                    productos,
                    contador: counter
                });
            });

        });
});

//===========================================================
//  Mostrar un producto por ID
//===========================================================
app.get('/producto/buscar/:nombre', verificaToken, (req, res) => {
    let nombre = req.params.nombre;
    let regexNombre = new RegExp(nombre, 'i');
    Producto.find({ nombre: regexNombre }, )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            };

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'prodcto no encontrado'
                    }
                });
            };

            Producto.count({ nombre: regexNombre }, (err, counter) => {
                res.json({
                    ok: true,
                    productos,
                    contador: counter
                });
            });

        });
});

//===========================================================
//  Crear un producto
//===========================================================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        categoria: body.categoria,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible
    });

    producto.save((err, productoNuevo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        };
        if (!productoNuevo) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        };
        res.status(201).json({
            ok: true,
            categoria: productoNuevo
        });
    })

});

//===========================================================
//  Actualizar un producto por ID
//===========================================================
app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: productoDB
        });

    });
});
//===========================================================
//  Borrar un producto por ID
//===========================================================
app.delete('/producto/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let disponibilidad = { disponible: false };

    Producto.findByIdAndUpdate(id, disponibilidad, { new: true }, (err, productoDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: productoDeleted
        });

    });

});

module.exports = app;