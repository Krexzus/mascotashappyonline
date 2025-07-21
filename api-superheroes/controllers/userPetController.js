import express from "express";
import Pet from "../models/petModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Función helper para buscar mascota por userId (maneja tipos number y string)
async function findPetByUserId(userId) {
    console.log('🔍 HELPER - Buscando mascota para userId:', userId, 'tipo:', typeof userId);
    
    // Intentar buscar como está
    let pet = await Pet.findOne({ userId: userId });
    
    // Si no encuentra y es número, intentar como string
    if (!pet && typeof userId === 'number') {
        console.log('🔍 HELPER - Intentando buscar como string:', userId.toString());
        pet = await Pet.findOne({ userId: userId.toString() });
    }
    
    // Si no encuentra y es string, intentar como número
    if (!pet && typeof userId === 'string') {
        const numericUserId = parseInt(userId);
        if (!isNaN(numericUserId)) {
            console.log('🔍 HELPER - Intentando buscar como número:', numericUserId);
            pet = await Pet.findOne({ userId: numericUserId });
        }
    }
    
    console.log('🔍 HELPER - Mascota encontrada:', pet ? 'SÍ' : 'NO');
    return pet;
}

// GET /api/pets/my-pet - Obtener la mascota del usuario autenticado
router.get("/pets/my-pet", async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('🔍 DEBUG GET - Buscando mascota para userId:', userId, 'tipo:', typeof userId);
        
        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            // Debugging para ver todas las mascotas
            const allPets = await Pet.find({});
            console.log('🔍 DEBUG GET - Total mascotas:', allPets.length);
            console.log('🔍 DEBUG GET - UserIds en DB:', allPets.map(p => ({ id: p.userId, tipo: typeof p.userId })));
            
            return res.status(404).json({
                success: false,
                message: "No tienes una mascota. Puedes crear una nueva.",
                instructions: "Usa POST /api/pets/my-pet para crear tu mascota",
                debug: {
                    buscandoUserId: userId,
                    tipoUserId: typeof userId,
                    totalMascotas: allPets.length,
                    userIdsEnDB: allPets.map(p => p.userId)
                }
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
        const existingPet = await findPetByUserId(userId);
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
        console.log('🔍 DEBUG - Buscando mascota para userId:', userId);
        console.log('🔍 DEBUG - Tipo de userId:', typeof userId);
        
        // Buscar mascota con función helper
        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            // Buscar todas las mascotas para debugging
            const allPets = await Pet.find({});
            console.log('🔍 DEBUG - Total mascotas en DB:', allPets.length);
            console.log('🔍 DEBUG - UserIds en DB:', allPets.map(p => ({ id: p.userId, tipo: typeof p.userId })));
            
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota",
                debug: {
                    buscandoUserId: userId,
                    tipoUserId: typeof userId,
                    totalMascotas: allPets.length,
                    userIdsEnDB: allPets.map(p => p.userId)
                }
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
        console.log('🔍 DEBUG WATER - Buscando mascota para userId:', userId, 'tipo:', typeof userId);
        
        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            // Debugging adicional
            const allPets = await Pet.find({});
            console.log('🔍 DEBUG WATER - UserIds en DB:', allPets.map(p => ({ id: p.userId, tipo: typeof p.userId })));
            
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota",
                debug: {
                    buscandoUserId: userId,
                    tipoUserId: typeof userId,
                    userIdsEnDB: allPets.map(p => p.userId)
                }
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
        const pet = await findPetByUserId(userId);
        
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
        const pet = await findPetByUserId(userId);
        
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

// POST /api/pets/my-pet/customize - Agregar item a la mascota
router.post("/pets/my-pet/customize", async (req, res) => {
    try {
        const userId = req.user.id;
        const { item } = req.body;

        // Validar que se envíe un item
        if (!item || !item.nombre || !item.tipo) {
            return res.status(400).json({
                success: false,
                message: "Debes enviar un item válido con nombre y tipo",
                ejemplo: {
                    item: {
                        nombre: "Sombrero Rojo",
                        tipo: "sombrero",
                        color: "#FF0000",
                        descripcion: "Un elegante sombrero rojo"
                    }
                }
            });
        }

        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        // Crear item sin ID manual - MongoDB asignará uno automáticamente
        const nuevoItem = {
            nombre: item.nombre,
            tipo: item.tipo,
            color: item.color || "#000000",
            descripcion: item.descripcion || "",
            fechaObtenido: new Date().toISOString(),
            equipado: item.equipado || false
        };
        
        console.log('🔍 DEBUG CUSTOMIZE - Creando item con ID:', nuevoItem.id);
        console.log('🔍 DEBUG CUSTOMIZE - Items actuales:', pet.items.length);

        pet.items.push(nuevoItem);
        console.log('🔍 DEBUG CUSTOMIZE - Items después de agregar:', pet.items.length);
        console.log('🔍 DEBUG CUSTOMIZE - Último item agregado:', pet.items[pet.items.length - 1]);
        
        // Aumentar felicidad por personalización
        pet.felicidad = Math.min(100, pet.felicidad + 8);
        pet.ultimaActualizacion = new Date().toISOString();

        // Marcar el array de items como modificado para MongoDB
        pet.markModified('items');
        await pet.save();
        
        console.log('🔍 DEBUG CUSTOMIZE - Mascota guardada exitosamente');
        
        // Verificar que se guardó correctamente
        const petVerificacion = await findPetByUserId(userId);
        console.log('🔍 DEBUG CUSTOMIZE - Items después de guardar:', petVerificacion.items.length);
        console.log('🔍 DEBUG CUSTOMIZE - Items guardados:', petVerificacion.items.map(i => ({ id: i.id, nombre: i.nombre })));

        res.json({
            success: true,
            message: `¡${item.nombre} agregado a tu mascota! 🎨`,
            data: {
                mascota: pet,
                nuevoItem: nuevoItem,
                totalItems: pet.items.length
            },
            stats: {
                felicidad: pet.felicidad,
                totalItems: pet.items.length
            }
        });
    } catch (error) {
        console.error("Error al personalizar mascota:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// GET /api/pets/my-pet/items - Ver todos los items de la mascota
router.get("/pets/my-pet/items", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        // Categorizar items por tipo
        const itemsPorTipo = pet.items.reduce((acc, item) => {
            if (!acc[item.tipo]) {
                acc[item.tipo] = [];
            }
            acc[item.tipo].push(item);
            return acc;
        }, {});

        res.json({
            success: true,
            message: "Items de tu mascota",
            data: {
                totalItems: pet.items.length,
                items: pet.items,
                itemsPorTipo: itemsPorTipo,
                tiposDisponibles: Object.keys(itemsPorTipo)
            }
        });
    } catch (error) {
        console.error("Error al obtener items:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// PUT /api/pets/my-pet/items/:itemId/equip - Equipar/desequipar item
router.put("/pets/my-pet/items/:itemId/equip", async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId; // NO convertir a parseInt, usar el string directamente
        const { equipado } = req.body;

        console.log('🔍 DEBUG EQUIP - UserId:', userId);
        console.log('🔍 DEBUG EQUIP - ItemId buscado:', itemId, 'tipo:', typeof itemId);

        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        console.log('🔍 DEBUG EQUIP - Total items en mascota:', pet.items.length);
        console.log('🔍 DEBUG EQUIP - IDs de items:', pet.items.map(i => ({ id: i.id, tipo: typeof i.id, nombre: i.nombre })));

        // Buscar el item usando el campo id que realmente existe
        const item = pet.items.find(i => i.id === itemId);
        console.log('🔍 DEBUG EQUIP - Item encontrado:', item ? 'SÍ' : 'NO');
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item no encontrado",
                debug: {
                    itemIdBuscado: itemId,
                    tipoItemId: typeof itemId,
                    itemsDisponibles: pet.items.map(i => ({ id: i.id, nombre: i.nombre, tipo: typeof i.id }))
                }
            });
        }

        // Si se está equipando, desequipar otros items del mismo tipo
        if (equipado) {
            pet.items.forEach(i => {
                if (i.tipo === item.tipo && i.id !== itemId) {
                    i.equipado = false;
                }
            });
        }

        // Cambiar estado del item
        item.equipado = equipado;
        pet.ultimaActualizacion = new Date().toISOString();

        // Marcar el array de items como modificado para MongoDB
        pet.markModified('items');
        await pet.save();
        
        console.log('🔍 DEBUG EQUIP - Item después de equipar:', { 
            id: item.id, 
            nombre: item.nombre, 
            equipado: item.equipado,
            tipoEquipado: typeof item.equipado
        });

        res.json({
            success: true,
            message: equipado ? `¡${item.nombre} equipado! 👕` : `${item.nombre} desequipado`,
            data: {
                item: item,
                itemsEquipados: pet.items.filter(i => i.equipado)
            }
        });
    } catch (error) {
        console.error("Error al equipar item:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// DELETE /api/pets/my-pet/items/:itemId - Eliminar item
router.delete("/pets/my-pet/items/:itemId", async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId; // NO convertir a parseInt, usar el string directamente

        console.log('🔍 DEBUG DELETE - UserId:', userId);
        console.log('🔍 DEBUG DELETE - ItemId buscado:', itemId, 'tipo:', typeof itemId);

        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        console.log('🔍 DEBUG DELETE - Total items en mascota:', pet.items.length);
        console.log('🔍 DEBUG DELETE - IDs de items:', pet.items.map(i => ({ id: i.id, tipo: typeof i.id, nombre: i.nombre })));

        // Buscar el item usando el campo id que realmente existe
        const itemIndex = pet.items.findIndex(i => i.id === itemId);
        console.log('🔍 DEBUG DELETE - Item encontrado:', itemIndex !== -1 ? 'SÍ' : 'NO');
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item no encontrado",
                debug: {
                    itemIdBuscado: itemId,
                    tipoItemId: typeof itemId,
                    itemsDisponibles: pet.items.map(i => ({ id: i.id, nombre: i.nombre, tipo: typeof i.id }))
                }
            });
        }

        // Eliminar el item
        const itemEliminado = pet.items.splice(itemIndex, 1)[0];
        pet.ultimaActualizacion = new Date().toISOString();

        await pet.save();

        res.json({
            success: true,
            message: `${itemEliminado.nombre} eliminado de tu mascota`,
            data: {
                itemEliminado: itemEliminado,
                totalItems: pet.items.length
            }
        });
    } catch (error) {
        console.error("Error al eliminar item:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// GET /api/pets/my-pet/appearance - Ver apariencia actual de la mascota
router.get("/pets/my-pet/appearance", async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = await findPetByUserId(userId);
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "No se encontró tu mascota"
            });
        }

        console.log('🔍 DEBUG APPEARANCE - Total items:', pet.items.length);
        console.log('🔍 DEBUG APPEARANCE - Todos los items:', pet.items.map(i => ({ 
            id: i.id, 
            nombre: i.nombre, 
            equipado: i.equipado, 
            tipoEquipado: typeof i.equipado 
        })));
        
        // Filtro robusto que maneja diferentes tipos de datos
        const itemsEquipados = pet.items.filter(item => {
            return item.equipado === true || item.equipado === 'true' || item.equipado === 1;
        });
        console.log('🔍 DEBUG APPEARANCE - Items equipados encontrados:', itemsEquipados.length);
        console.log('🔍 DEBUG APPEARANCE - Items equipados:', itemsEquipados.map(i => ({ 
            id: i.id, 
            nombre: i.nombre, 
            equipado: i.equipado 
        })));
        
        // Crear descripción de apariencia
        const apariencia = {
            nombre: pet.nombre,
            tipo: pet.tipo,
            personalidad: pet.personalidad,
            itemsEquipados: itemsEquipados,
            descripcion: generarDescripcionApariencia(pet, itemsEquipados)
        };

        res.json({
            success: true,
            message: "Apariencia actual de tu mascota",
            data: apariencia
        });
    } catch (error) {
        console.error("Error al obtener apariencia:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// Función helper para generar descripción de apariencia
function generarDescripcionApariencia(pet, itemsEquipados) {
    let descripcion = `${pet.nombre} es un ${pet.tipo} con personalidad ${pet.personalidad}.`;
    
    if (itemsEquipados.length === 0) {
        descripcion += " No lleva ningún accesorio puesto.";
    } else {
        descripcion += " Lleva puesto: ";
        const descripciones = itemsEquipados.map(item => {
            return `${item.nombre} (${item.tipo})`;
        });
        descripcion += descripciones.join(", ") + ".";
    }
    
    // Agregar estado emocional
    if (pet.felicidad >= 80) {
        descripcion += " Se ve muy feliz! 😄";
    } else if (pet.felicidad >= 60) {
        descripcion += " Se ve contento 😊";
    } else if (pet.felicidad >= 40) {
        descripcion += " Se ve normal 😐";
    } else {
        descripcion += " Se ve triste 😢";
    }
    
    return descripcion;
}

export default router;