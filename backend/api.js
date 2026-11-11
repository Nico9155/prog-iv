import 'dotenv/config';
import app from './incidencias.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API incidencias escuchando en ${PORT}`);
});
