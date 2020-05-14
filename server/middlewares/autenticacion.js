const jwt = require('jsonwebtoken');



//===========================================================
//  Verificar Token
//===========================================================

const verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token es inválido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//===========================================================
//  Verificar AdminRole
//===========================================================
const verificaAdminRole = (req, res, next) => {
    let role = req.usuario.role;
    if (role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos para realizar esta acción'
            }
        });

    }
};

module.exports = {
    verificaToken,
    verificaAdminRole
};