import express from "express";
import cors from "cors";
import heroController from "./controllers/heroController.js";
import petController from "./controllers/petController.js";
import authController from "./controllers/authController.js";
import userPetController from "./controllers/userPetController.js";
import petService from "./services/petService.js";
import mongoose from 'mongoose';

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://krexzus:2UJOoognhkFO2D6i@mascotashappy.ecnmwrz.mongodb.net/mascotashappy?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    console.log('🔐 Sistema de autenticación habilitado');
    console.log('🎮 Sistema de mascotas privadas tipo Pou listo');
})
.catch(err => {
    console.error('❌ Error al conectar a MongoDB Atlas:', err.message);
    console.error('💡 Verifica tu conexión a internet y las credenciales de MongoDB');
    console.error('⚠️ La aplicación continuará funcionando pero sin base de datos');
    // No terminar el proceso, continuar sin MongoDB
});

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Inicializar sistema Pou al arrancar (de forma segura)
async function inicializarSistemaPou() {
    try {
        console.log('🔄 Inicializando sistema Pou...');
        // Solo inicializar si MongoDB está conectado
        if (mongoose.connection.readyState === 1) {
            await petService.migrarMascotasExistentes();
            console.log('✅ Sistema Pou inicializado correctamente');
        } else {
            console.log('⏳ Esperando conexión a MongoDB para inicializar Pou...');
        }
    } catch (error) {
        console.error('❌ Error al inicializar sistema Pou:', error);
        console.log('⚠️ La aplicación continuará funcionando sin la inicialización Pou');
    }
}

// Inicializar después de un pequeño delay para dar tiempo a MongoDB
setTimeout(() => {
    inicializarSistemaPou();
}, 2000);

app.use("/api", heroController);
// app.use("/api", petController); // DESHABILITADO - Usar userPetController en su lugar
app.use("/api", authController);
app.use("/api", userPetController);

app.get("/", (req, res) => {
    res.json({ 
        message: "🎮 API de Mascotas Privadas tipo Pou",
        version: "3.0",
        description: "Cada usuario tiene su propia mascota privada que solo él puede ver y cuidar",
        features: [
            "🔐 Sistema de autenticación con JWT",
            "👤 Registro y login de usuarios",
            "🐾 Mascotas privadas por usuario",
            "🎮 Sistema Pou completo (alimentar, dar agua, ejercitar)",
            "📊 Degradación temporal automática",
            "🏥 Sistema de enfermedades y curas",
            "😊 Personalidades dinámicas",
            "📈 Estadísticas de hambre, sed, energía y felicidad"
        ],
        endpoints: {
            auth: [
                "POST /api/auth/register - Registrar usuario",
                "POST /api/auth/login - Iniciar sesión",
                "GET /api/auth/profile - Ver perfil (requiere token)"
            ],
            pets: [
                "GET /api/pets/my-pet - Ver tu mascota (requiere token)",
                "POST /api/pets/my-pet - Crear mascota (requiere token)",
                "POST /api/pets/my-pet/feed - Alimentar mascota (requiere token)",
                "POST /api/pets/my-pet/water - Dar agua (requiere token)",
                "POST /api/pets/my-pet/exercise - Ejercitar (requiere token)",
                "GET /api/pets/my-pet/status - Estado detallado (requiere token)"
            ]
        },
        instructions: "1. Regístrate, 2. Inicia sesión, 3. Crea tu mascota, 4. ¡Cuídala como en Pou!"
    });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    console.log('⚠️ La aplicación continuará funcionando...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    console.log('⚠️ La aplicación continuará funcionando...');
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🎮 Sistema Pou activo - Las mascotas necesitan cuidado constante!`);
    console.log(`🌐 Servidor listo para recibir conexiones`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('🔄 Cerrando servidor gracefully...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        mongoose.connection.close();
    });
});

process.on('SIGINT', () => {
    console.log('🔄 Cerrando servidor gracefully...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        mongoose.connection.close();
    });
});

