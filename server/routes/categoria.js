const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

module.exports = app;

//===========================================================
//  Mostrar todas las categorias
//===========================================================
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 10000000;

    Categoria.find()
        .skip(Number(desde))
        .limit(Number(limite))
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            Categoria.count((err, counter) => {
                res.json({
                    ok: true,
                    desde,
                    limite,
                    categorias,
                    contador: counter
                });
            });

        });

});


//===========================================================
//  Mostrar una categoría por ID
//===========================================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.find({ _id: id }, )
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            };

            if (!categorias) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'categoría no encontrada'
                    }
                });
            };

            Categoria.count({ _id: id }, (err, counter) => {
                res.json({
                    ok: true,
                    categorias,
                    contador: counter
                });
            });

        });
});


//===========================================================
//  Crear nueva categoria
//===========================================================
app.post('/categoria', verificaToken, (req, res) => {

    //devuelve la nueva categoria, req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaNueva) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        };
        if (!categoriaNueva) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaNueva
        });
    });
});

//===========================================================
//  Actualizar categoria
//===========================================================
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //solo se actualizará la descripcion de la categoria
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    });


});

//===========================================================
//  Borrar categoria
//===========================================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // condicion solo puede borrar ADMIN_ROLE
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        };

        if (!categoriaDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoría no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoriaDeleted
        });

    });

});