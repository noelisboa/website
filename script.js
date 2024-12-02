const express = require('express');
const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Datos válidos de ejemplo (puedes usar una base de datos aquí)
const usuariosValidos = [
    { nombre: 'Juan', apellido: 'Pérez' },
    { nombre: 'Ana', apellido: 'Gómez' },
];

// Ruta para validar acceso
app.post('/validar', (req, res) => {
    const { nombre, apellido } = req.body;

    // Validar si los datos existen en la lista
    const usuarioValido = usuariosValidos.some(
        (user) => user.nombre === nombre && user.apellido === apellido
    );

    if (usuarioValido) {
        res.json({ acceso: true, mensaje: 'Acceso permitido.' });
    } else {
        res.status(401).json({ acceso: false, mensaje: 'Nombre o apellido incorrecto.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
