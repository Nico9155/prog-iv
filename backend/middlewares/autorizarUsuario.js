export default function autorizarUsuarios(perfilAutorizados = []) {
    return (req, res, next) => {
        const usuario = req.usuario;

        if (!usuario || !perfilAutorizados.includes(usuario.rol)) {
            return res.status(403).json({
                mensaje: 'Acceso Denegado'
            });
        }

        next();
    };
}
