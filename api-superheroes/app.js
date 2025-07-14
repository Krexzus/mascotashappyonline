import express from "express";
import cors from "cors";
import heroController from "./controllers/heroController.js";
import petController from "./controllers/petController.js";
import petService from "./services/petService.js";
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://krexzus:2UJOoognhkFO2D6i@mascotashappy.ecnmwrz.mongodb.net/?retryWrites=true&w=majority&appName=mascotashappy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicializar sistema Pou al arrancar
async function inicializarSistemaPou() {
    try {
        console.log('🔄 Inicializando sistema Pou...');
        await petService.migrarMascotasExistentes();
        console.log('✅ Sistema Pou inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar sistema Pou:', error);
    }
}

// Inicializar al arrancar
inicializarSistemaPou();

app.use("/api", heroController);
app.use("/api", petController);

app.get("/", (req, res) => {
    res.json({ 
        message: "API de Superhéroes y Mascotas Pou",
        version: "2.0",
        features: [
            "Sistema de héroes",
            "Sistema Pou para mascotas",
            "Degradación temporal automática",
            "Enfermedades y personalidades",
            "Estadísticas de hambre, sed y energía"
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🎮 Sistema Pou activo - Las mascotas necesitan cuidado constante!`);
});

