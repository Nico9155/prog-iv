import jwt from 'jsonwebtoken';
import UsuariosServicio from '../servicios/usuarios.js';

const usuarioServicio = new UsuariosServicio();

// VALIDA EL TOKEN BEARER Y DEJA EL USUARIO EN REQ.USUARIO
const autenticar = async (req, res, next) => {
    try {
        const [scheme, token] = (req.headers.authorization ?? '').split(' ');
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ mensaje: 'Token requerido.' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await usuarioServicio.buscarPorId(payload.id_usuario);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Token incorrecto.' });
        }

        req.usuario = usuario;
        next();
    } catch (exc) {
        if (exc.name === 'JsonWebTokenError' || exc.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token incorrecto o expirado.' });
        }
        next(exc);
    }
};

export default autenticar;
