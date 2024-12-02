const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Archivo para almacenar solicitudes temporalmente
const solicitudesPath = './solicitudes.json';

// Ruta para guardar solicitudes
app.post('/solicitar-acceso', (req, res) => {
    const { nombre, apellido } = req.body;

    if (!nombre || !apellido) {
        return res.status(400).json({ mensaje: 'Nombre y apellido son requeridos.' });
    }

    // Leer las solicitudes existentes
    let solicitudes = [];
    if (fs.existsSync(solicitudesPath)) {
        solicitudes = JSON.parse(fs.readFileSync(solicitudesPath, 'utf8'));
    }

    // Guardar la nueva solicitud
    solicitudes.push({ nombre, apellido, estado: 'pendiente' });
    fs.writeFileSync(solicitudesPath, JSON.stringify(solicitudes, null, 2));

    res.json({ mensaje: 'Solicitud enviada correctamente.' });
});

// Ruta para revisar solicitudes
app.get('/solicitudes', (req, res) => {
    if (fs.existsSync(solicitudesPath)) {
        const solicitudes = JSON.parse(fs.readFileSync(solicitudesPath, 'utf8'));
        res.json(solicitudes);
    } else {
        res.json([]);
    }
});

// Ruta para actualizar el estado de una solicitud
app.post('/actualizar-solicitud', (req, res) => {
    const { nombre, apellido, estado } = req.body;

    if (!nombre || !apellido || !estado) {
        return res.status(400).json({ mensaje: 'Datos incompletos.' });
    }

    if (fs.existsSync(solicitudesPath)) {
        let solicitudes = JSON.parse(fs.readFileSync(solicitudesPath, 'utf8'));
        solicitudes = solicitudes.map((solicitud) => {
            if (solicitud.nombre === nombre && solicitud.apellido === apellido) {
                return { ...solicitud, estado };
            }
            return solicitud;
        });

        fs.writeFileSync(solicitudesPath, JSON.stringify(solicitudes, null, 2));
        res.json({ mensaje: 'Estado actualizado correctamente.' });
    } else {
        res.status(404).json({ mensaje: 'No se encontraron solicitudes.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
