const express = require('express');
const fileUpload = require('express-fileupload');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('.'));

// Ruta para guardar asistencia
app.post('/guardar-asistencia', (req, res) => {
    try {
        const nuevaAsistencia = req.body;
        const filePath = path.join(__dirname, 'data', 'Asistencia.xlsx');
        
        // Crear carpeta data si no existe
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        
        let workbook;
        let worksheet;
        let datos = [];
        
        // Verificar si el archivo existe
        if (fs.existsSync(filePath)) {
            // Leer archivo existente
            workbook = XLSX.readFile(filePath);
            worksheet = workbook.Sheets[workbook.SheetNames[0]];
            datos = XLSX.utils.sheet_to_json(worksheet);
        } else {
            // Crear nuevo workbook si no existe
            workbook = XLSX.utils.book_new();
            datos = [];
        }
        
        // Agregar nuevo registro
        datos.push(nuevaAsistencia);
        
        // Convertir a hoja de cálculo
        worksheet = XLSX.utils.json_to_sheet(datos);
        
        // Reemplazar la hoja existente o agregar nueva
        if (workbook.SheetNames.length > 0) {
            workbook.Sheets[workbook.SheetNames[0]] = worksheet;
        } else {
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');
        }
        
        // Guardar archivo
        XLSX.writeFile(workbook, filePath);
        
        res.json({ success: true, message: 'Asistencia guardada correctamente' });
    } catch (error) {
        console.error('Error al guardar asistencia:', error);
        res.status(500).json({ success: false, message: 'Error al guardar asistencia' });
    }
});

// Ruta para obtener asistencias
app.get('/obtener-asistencias', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'Asistencia.xlsx');
        
        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }
        
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(worksheet);
        
        res.json(datos);
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        res.status(500).json({ success: false, message: 'Error al obtener asistencias' });
    }
});

// Ruta principal - servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Desde tu navegador, ve a: http://localhost:${PORT}`);
});