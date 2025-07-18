import express from "express";
import Pet from "../models/petModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// GET /api/pets/my-pet - Obtener la mascota del usuario autenticado
router.get("/pets/my-pet", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await Pet.findOne({ userId: userId });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No tienes una mascota. Puedes crear una nueva.",
                instructions: "Usa POST /api/pets/my-pet para crear tu mascota"
            });
        }

        res.json({
            success: true,
            message: "¡Aquí está tu mascota!",
            data: pet
        });
    } catch (error) {
        console.error("Error al obtener mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// POST /api/pets/my-pet - Crear mascota para el usuario autenticado
router.post("/pets/my-pet", async (req, res) => {
    try {
        const userId = req.user.id;
        const { nombre, tipo, superpoder } = req.body;

        // Verificar si el usuario ya tiene una mascota
        const existingPet = await Pet.findOne({ userId: userId });
        if (existingPet) {
            return res.status(409).json({
                success: false,
                message: "Ya tienes una mascota. Solo puedes tener una mascota por usuario.",
                data: existingPet
            });
        }

        // Obtener el siguiente ID
        const lastPet = await Pet.findOne().sort({ id: -1 });
        const nextId = lastPet ? lastPet.id + 1 : 1;

        // Crear nueva mascota
        const nuevaMascota = new Pet({
            id: nextId,
            userId: userId,
            nombre: nombre || 'Mi Mascota',
            tipo: tipo || 'perro',
            superpoder: superpoder || 'lealtad',
            felicidad: 100,
            vida: 100,
            hambre: 0,
            sed: 0,
            energia: 100,
            peso: 50,
            personalidad: 'normal',
            enfermedades: [],
            items: [],
            ultimaActualizacion: new Date().toISOString()
        });

        await nuevaMascota.save();

        res.status(201).json({
            success: true,
            message: `¡Bienvenido ${nombre}! Tu mascota ha sido creada. ¡Cuídala como en Pou!`,
            data: nuevaMascota
        });
    } catch (error) {
        console.error("Error al crear mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// POST /api/pets/my-pet/feed - Alimentar mascota
router.post("/pets/my-pet/feed", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await Pet.findOne({ userId: userId });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        // Lógica de alimentación tipo Pou
        if (pet.hambre <= 10) {
            // Sobrealimentación
            pet.felicidad = Math.max(0, pet.felicidad - 5);
            pet.peso = Math.min(100, pet.peso + 5);
            pet.energia = Math.max(0, pet.energia - 2);
        } else {
            // Alimentación normal
            pet.felicidad = Math.min(100, pet.felicidad + 12);
            pet.vida = Math.min(100, pet.vida + 8);
            pet.hambre = Math.max(0, pet.hambre - 25);
            pet.energia = Math.min(100, pet.energia + 4);
            pet.peso = Math.min(100, pet.peso + 1);
        }

        pet.ultimaActualizacion = new Date().toISOString();
        await pet.save();

        res.json({
            success: true,
            message: pet.hambre <= 25 ? "¡Tu mascota ha sido alimentada! 🍖" : "Tu mascota no tenía mucha hambre, pero comió un poco.",
            data: pet,
            stats: {
                hambre: pet.hambre,
                felicidad: pet.felicidad,
                energia: pet.energia,
                peso: pet.peso
            }
        });
    } catch (error) {
        console.error("Error al alimentar mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// POST /api/pets/my-pet/water - Dar agua a la mascota
router.post("/pets/my-pet/water", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await Pet.findOne({ userId: userId });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        // Lógica de hidratación
        pet.felicidad = Math.min(100, pet.felicidad + 4);
        pet.vida = Math.min(100, pet.vida + 4);
        pet.sed = Math.max(0, pet.sed - 30);
        pet.energia = Math.min(100, pet.energia + 2);
        pet.ultimaActualizacion = new Date().toISOString();

        await pet.save();

        res.json({
            success: true,
            message: "¡Tu mascota ha bebido agua! 💧",
            data: pet,
            stats: {
                sed: pet.sed,
                felicidad: pet.felicidad,
                energia: pet.energia
            }
        });
    } catch (error) {
        console.error("Error al dar agua a mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// POST /api/pets/my-pet/exercise - Ejercitar mascota
router.post("/pets/my-pet/exercise", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await Pet.findOne({ userId: userId });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        // Lógica de ejercicio
        pet.energia = Math.max(0, pet.energia - 15);
        pet.felicidad = Math.min(100, pet.felicidad + 10);
        pet.peso = Math.max(0, pet.peso - 5);
        pet.hambre = Math.min(100, pet.hambre + 20);
        pet.sed = Math.min(100, pet.sed + 15);
        pet.ultimaActualizacion = new Date().toISOString();

        await pet.save();

        res.json({
            success: true,
            message: "¡Tu mascota ha hecho ejercicio! 💪",
            data: pet,
            stats: {
                energia: pet.energia,
                felicidad: pet.felicidad,
                peso: pet.peso,
                hambre: pet.hambre,
                sed: pet.sed
            }
        });
    } catch (error) {
        console.error("Error al ejercitar mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// GET /api/pets/my-pet/status - Obtener estado detallado de la mascota
router.get("/pets/my-pet/status", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await Pet.findOne({ userId: userId });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        // Calcular estado general
        const estadoGeneral = () => {
            const promedio = (pet.felicidad + pet.vida + pet.energia + (100 - pet.hambre) + (100 - pet.sed)) / 5;
            if (promedio >= 80) return "Excelente 😄";
            if (promedio >= 60) return "Bien 😊";
            if (promedio >= 40) return "Regular 😐";
            if (promedio >= 20) return "Mal 😟";
            return "Crítico 😰";
        };

        res.json({
            success: true,
            message: "Estado detallado de tu mascota",
            data: {
                mascota: pet,
                estadoGeneral: estadoGeneral(),
                necesidades: {
                    hambre: pet.hambre > 70 ? "¡Necesita comida urgente!" : pet.hambre > 40 ? "Tiene algo de hambre" : "Bien alimentada",
                    sed: pet.sed > 70 ? "¡Necesita agua urgente!" : pet.sed > 40 ? "Tiene algo de sed" : "Bien hidratada",
                    energia: pet.energia < 30 ? "¡Necesita descansar!" : pet.energia < 60 ? "Un poco cansada" : "Con buena energía",
                    felicidad: pet.felicidad < 30 ? "¡Muy triste!" : pet.felicidad < 60 ? "Un poco triste" : "Muy feliz"
                },
                recomendaciones: [
                    pet.hambre > 50 ? "🍖 Dale comida" : null,
                    pet.sed > 50 ? "💧 Dale agua" : null,
                    pet.energia < 40 ? "😴 Déjala descansar" : null,
                    pet.peso > 70 ? "🏃 Hazla ejercitar" : null,
                    pet.enfermedades.length > 0 ? "🏥 Necesita tratamiento médico" : null
                ].filter(Boolean)
            }
        });
    } catch (error) {
        console.error("Error al obtener estado de mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

export default router;