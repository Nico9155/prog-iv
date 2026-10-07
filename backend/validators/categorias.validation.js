export const categoriasValidation = {
    create: (req, res, next) => {
        const { descripcion } = req.body;

        if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
            return res.status(400).json({ 
                error: 'La descripción es obligatoria y debe ser un texto válido.' 
            });
        }

        req.body.descripcion = descripcion.trim();
        return next();
    },

    validateId: (req, res, next) => {
        const { id } = req.params;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return res.status(400).json({ 
                error: 'El ID proporcionado debe ser un número entero válido.' 
            });
        }

        return next();
    },

    update: (req, res, next) => {
        const { id } = req.params;
        const { descripcion } = req.body;

        if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return res.status(400).json({ 
                error: 'El ID proporcionado debe ser un número entero válido.' 
            });
        }

        if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
            return res.status(400).json({ 
                error: 'La descripción es obligatoria para poder actualizar la categoría.' 
            });
        }

        req.body.descripcion = descripcion.trim();
        return next();
    }
};
