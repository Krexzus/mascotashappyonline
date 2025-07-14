import * as petRepository from '../repositories/petRepository.js';
import Pet from '../models/petModel.js';

// Función para inicializar propiedades faltantes del sistema Pou
function inicializarPropiedadesPou(pet) {
    if (pet.hambre === undefined) pet.hambre = 0;
    if (pet.sed === undefined) pet.sed = 0;
    if (pet.energia === undefined) pet.energia = 100;
    if (pet.peso === undefined) pet.peso = 50; // Peso normal (0-100)
    if (pet.ultimaActualizacion === undefined) {
        pet.ultimaActualizacion = new Date().toISOString();
    }
    if (pet.personalidad === undefined) pet.personalidad = 'normal';
    if (pet.enfermedades === undefined) pet.enfermedades = [];
    if (pet.items === undefined) pet.items = [];
    
    // Asegurar que las estadísticas estén en rangos válidos
    pet.felicidad = Math.max(0, Math.min(100, pet.felicidad || 100));
    pet.vida = Math.max(0, Math.min(100, pet.vida || 100));
    pet.energia = Math.max(0, Math.min(100, pet.energia || 100));
    pet.hambre = Math.max(0, Math.min(100, pet.hambre || 0));
    pet.sed = Math.max(0, Math.min(100, pet.sed || 0));
    pet.peso = Math.max(0, Math.min(100, pet.peso || 50));
    
    return pet;
}

export async function getAllPets() {
    try {
        const pets = await petRepository.getPets();
        // Inicializar propiedades faltantes para todas las mascotas
        return pets.map(pet => inicializarPropiedadesPou(pet));
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        throw new Error('Error al obtener las mascotas');
    }
}

export async function addPet(newPet) {
    try {
        const pets = await petRepository.getPets();
        newPet.id = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
        
        // Inicializar propiedades del sistema Pou
        newPet = inicializarPropiedadesPou(newPet);
        
        pets.push(newPet);
        await petRepository.savePets(pets);
        return newPet;
    } catch (error) {
        console.error('Error al agregar mascota:', error);
        throw new Error('Error al agregar la mascota');
    }
}

export async function updatePet(id, updates) {
    try {
        id = parseInt(id);
        const pets = await petRepository.getPets();
        const pet = pets.find(p => p.id === id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        // Aplicar actualizaciones
        Object.assign(pet, updates);
        
        // Inicializar propiedades faltantes
        inicializarPropiedadesPou(pet);
        
        await petRepository.savePets(pets);
        return pet;
    } catch (error) {
        console.error('Error al actualizar mascota:', error);
        throw error;
    }
}

export async function deletePet(id) {
    try {
        id = parseInt(id);
        const pets = await petRepository.getPets();
        const index = pets.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Mascota no encontrada');
        const deleted = pets.splice(index, 1);
        await petRepository.savePets(pets);
        return deleted[0];
    } catch (error) {
        console.error('Error al eliminar mascota:', error);
        throw error;
    }
}

// --- Sistema Pou Mejorado y Constante ---
// Enfermedades expandidas y sus efectos
const ENFERMEDADES = {
    'sarna': { vida: -5, felicidad: -3 },
    'gripe': { vida: -10, felicidad: -5 },
    'pelo de sillon': { vida: -15, felicidad: -2 },
    'pelo de cola': { vida: -8, felicidad: -1 },
    'resfriado': { vida: -8, felicidad: -10, energia: -5 },
    'parasitos': { vida: -3, felicidad: -5, energia: -10 },
    'ansiedad': { felicidad: -15, personalidad: 'nervioso' },
    'fatiga': { vida: -5, felicidad: -8, energia: -20 },
    'alergias': { felicidad: -12, vida: -3 },
    'depresion': { felicidad: -25, personalidad: 'triste' },
    'estres': { felicidad: -10, energia: -15, personalidad: 'irritable' },
    'obesidad': { vida: -10, felicidad: -15, energia: -20, peso: +5 },
    'indigestion': { vida: -5, felicidad: -10, energia: -15, peso: +1 },
    'vomito': { vida: -3, felicidad: -8, energia: -10, peso: +1 }
};

// Personalidades y sus efectos
const PERSONALIDADES = {
    'normal': { multiplicador: 1 },
    'alegre': { multiplicador: 1.2, felicidadBonus: 5 },
    'triste': { multiplicador: 0.8, felicidadPenalty: -10 },
    'nervioso': { multiplicador: 0.9, energiaPenalty: -5 },
    'irritable': { multiplicador: 0.7, felicidadPenalty: -15 },
    'energico': { multiplicador: 1.1, energiaBonus: 10 }
};

function aplicarEfectosEnfermedades(pet) {
    if (!pet.enfermedades || pet.enfermedades.length === 0) return pet;
    
    pet.enfermedades.forEach(enfermedad => {
        if (ENFERMEDADES[enfermedad]) {
            const efectos = ENFERMEDADES[enfermedad];
            if (efectos.vida) pet.vida = Math.max(0, pet.vida + efectos.vida);
            if (efectos.felicidad) pet.felicidad = Math.max(0, pet.felicidad + efectos.felicidad);
            if (efectos.energia) pet.energia = Math.max(0, pet.energia + efectos.energia);
            if (efectos.peso) pet.peso = Math.min(100, pet.peso + efectos.peso);
            if (efectos.personalidad) pet.personalidad = efectos.personalidad;
        }
    });
    
    return pet;
}

function aplicarEfectosPersonalidad(pet) {
    if (PERSONALIDADES[pet.personalidad]) {
        const efectos = PERSONALIDADES[pet.personalidad];
        if (efectos.felicidadBonus) pet.felicidad = Math.min(100, pet.felicidad + efectos.felicidadBonus);
        if (efectos.felicidadPenalty) pet.felicidad = Math.max(0, pet.felicidad + efectos.felicidadPenalty);
        if (efectos.energiaBonus) pet.energia = Math.min(100, pet.energia + efectos.energiaBonus);
        if (efectos.energiaPenalty) pet.energia = Math.max(0, pet.energia + efectos.energiaPenalty);
    }
    return pet;
}

// Función para recalcular personalidad basada en estadísticas
function recalcularPersonalidad(pet) {
    // Si no hay enfermedades, la personalidad es normal o según stats
    if (!pet.enfermedades || pet.enfermedades.length === 0) {
        if (pet.felicidad < 15) pet.personalidad = 'triste';
        else if (pet.felicidad < 35) pet.personalidad = 'nervioso';
        else if (pet.felicidad >= 85) pet.personalidad = 'alegre';
        else if (pet.energia > 80) pet.personalidad = 'energico';
        else pet.personalidad = 'normal';
    } else {
        // Si hay enfermedades, mantener la personalidad que puedan imponer las enfermedades
        // (por ejemplo, 'irritable' por estrés, 'triste' por depresión, etc.)
        // Si ninguna enfermedad impone personalidad, usar la lógica de stats
        let personalidadPorEnfermedad = null;
        for (const enf of pet.enfermedades) {
            if (ENFERMEDADES[enf] && ENFERMEDADES[enf].personalidad) {
                personalidadPorEnfermedad = ENFERMEDADES[enf].personalidad;
                break;
            }
        }
        if (personalidadPorEnfermedad) {
            pet.personalidad = personalidadPorEnfermedad;
        } else {
            if (pet.felicidad < 15) pet.personalidad = 'triste';
            else if (pet.felicidad < 35) pet.personalidad = 'nervioso';
            else if (pet.felicidad >= 85) pet.personalidad = 'alegre';
            else if (pet.energia > 80) pet.personalidad = 'energico';
            else pet.personalidad = 'normal';
        }
    }
    return pet;
}

// Función para forzar recálculo de personalidad (para debugging)
async function forzarRecalculoPersonalidad(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        inicializarPropiedadesPou(pet);
        recalcularPersonalidad(pet);
        await petRepository.updatePet(id, pet);
        
        return pet;
    } catch (error) {
        console.error('Error al forzar recálculo de personalidad:', error);
        throw error;
    }
}

// Función principal para degradar estadísticas con el tiempo (mejorada)
async function degradarEstadisticasTiempo(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        // Inicializar propiedades faltantes
        inicializarPropiedadesPou(pet);
        
        const ahora = new Date();
        const ultimaActualizacion = new Date(pet.ultimaActualizacion || ahora);
        const horasTranscurridas = (ahora - ultimaActualizacion) / (1000 * 60 * 60);
        
        // Solo actualizar si han pasado al menos 30 minutos
        if (horasTranscurridas < 0.5) {
            return pet;
        }
        
        // Degradación por hora (más constante)
        const degradacionPorHora = {
            felicidad: -1.5,  // Reducido de -2 para ser más constante
            vida: -0.8,       // Reducido de -1 para ser más constante
            energia: -2,       // Reducido de -3 para ser más constante
            hambre: +4,        // Reducido de +5 para ser más constante
            sed: +3            // Reducido de +4 para ser más constante
        };
        
        // Aplicar degradación con límites más estrictos
        const degradacionAplicada = Math.min(horasTranscurridas, 24); // Máximo 24 horas
        
        pet.felicidad = Math.max(0, pet.felicidad + (degradacionPorHora.felicidad * degradacionAplicada));
        pet.vida = Math.max(0, pet.vida + (degradacionPorHora.vida * degradacionAplicada));
        pet.energia = Math.max(0, pet.energia + (degradacionPorHora.energia * degradacionAplicada));
        pet.hambre = Math.min(100, pet.hambre + (degradacionPorHora.hambre * degradacionAplicada));
        pet.sed = Math.min(100, pet.sed + (degradacionPorHora.sed * degradacionAplicada));
        
        // Efectos del hambre y sed (más graduales)
        if (pet.hambre > 70) {
            pet.vida = Math.max(0, pet.vida - 1);
            pet.felicidad = Math.max(0, pet.felicidad - 3);
        }
        if (pet.sed > 70) {
            pet.vida = Math.max(0, pet.vida - 0.5);
            pet.energia = Math.max(0, pet.energia - 3);
        }
        
        // Cambios de personalidad más estables
        if (pet.felicidad < 15) pet.personalidad = 'triste';
        else if (pet.felicidad < 35) pet.personalidad = 'nervioso';
        else if (pet.felicidad > 85) pet.personalidad = 'alegre';
        else if (pet.energia > 80) pet.personalidad = 'energico';
        else pet.personalidad = 'normal';
        
        // Enfermedades aleatorias (más controladas)
        await generarEnfermedadesAleatorias(pet, degradacionAplicada);
        
        pet.ultimaActualizacion = ahora.toISOString();
        aplicarEfectosEnfermedades(pet);
        aplicarEfectosPersonalidad(pet);
        
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al degradar estadísticas:', error);
        throw error;
    }
}

// Función para degradación forzada (para pruebas)
async function degradarEstadisticasForzada(id, horasSimuladas = 1) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        // Inicializar propiedades faltantes
        inicializarPropiedadesPou(pet);
        
        // Degradación por hora
        const degradacionPorHora = {
            felicidad: -1.5,
            vida: -0.8,
            energia: -2,
            hambre: +4,
            sed: +3
        };
        
        // Aplicar degradación forzada
        pet.felicidad = Math.max(0, pet.felicidad + (degradacionPorHora.felicidad * horasSimuladas));
        pet.vida = Math.max(0, pet.vida + (degradacionPorHora.vida * horasSimuladas));
        pet.energia = Math.max(0, pet.energia + (degradacionPorHora.energia * horasSimuladas));
        pet.hambre = Math.min(100, pet.hambre + (degradacionPorHora.hambre * horasSimuladas));
        pet.sed = Math.min(100, pet.sed + (degradacionPorHora.sed * horasSimuladas));
        
        // Efectos del hambre y sed
        if (pet.hambre > 70) {
            pet.vida = Math.max(0, pet.vida - 1);
            pet.felicidad = Math.max(0, pet.felicidad - 3);
        }
        if (pet.sed > 70) {
            pet.vida = Math.max(0, pet.vida - 0.5);
            pet.energia = Math.max(0, pet.energia - 3);
        }
        
        // Cambios de personalidad
        if (pet.felicidad < 15) pet.personalidad = 'triste';
        else if (pet.felicidad < 35) pet.personalidad = 'nervioso';
        else if (pet.felicidad > 85) pet.personalidad = 'alegre';
        else if (pet.energia > 80) pet.personalidad = 'energico';
        else pet.personalidad = 'normal';
        
        // Enfermedades aleatorias
        await generarEnfermedadesAleatorias(pet, horasSimuladas);
        
        pet.ultimaActualizacion = new Date().toISOString();
        aplicarEfectosEnfermedades(pet);
        aplicarEfectosPersonalidad(pet);
        
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al degradar estadísticas forzada:', error);
        throw error;
    }
}

// Generar enfermedades aleatorias (más controlado)
async function generarEnfermedadesAleatorias(pet, horasTranscurridas) {
    try {
        const probabilidades = {
            'resfriado': 0.03, // 3% por hora (reducido)
            'parasitos': 0.02, // 2% por hora (reducido)
            'ansiedad': 0.025, // 2.5% por hora (reducido)
            'fatiga': 0.04,    // 4% por hora (reducido)
            'alergias': 0.015, // 1.5% por hora (reducido)
            'depresion': 0.005, // 0.5% por hora (reducido)
            'estres': 0.025    // 2.5% por hora (reducido)
        };
        
        // Limitar el número máximo de enfermedades
        if (pet.enfermedades.length >= 3) return;
        
        Object.entries(probabilidades).forEach(([enfermedad, prob]) => {
            if (Math.random() < prob * horasTranscurridas && 
                !pet.enfermedades.includes(enfermedad)) {
                pet.enfermedades.push(enfermedad);
            }
        });
    } catch (error) {
        console.error('Error al generar enfermedades:', error);
    }
}

export async function alimentarPet(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        if (pet.hambre === 0) {
            pet.felicidad = Math.max(0, pet.felicidad - 5);
            pet.peso = Math.min(100, pet.peso + 5);
            pet.energia = Math.max(0, pet.energia - 2);
            const probabilidadVomito = 0.1;
            const probabilidadIndigestion = 0.2;
            const probabilidadObesidad = 0.3;
            if (pet.peso > 60 && Math.random() < probabilidadObesidad) {
                pet.enfermedades.push('obesidad');
                pet.felicidad = Math.max(0, pet.felicidad - 12);
            } else if (Math.random() < probabilidadVomito) {
                pet.enfermedades.push('vomito');
                pet.felicidad = Math.max(0, pet.felicidad - 10);
                pet.vida = Math.max(0, pet.vida - 5);
            } else if (Math.random() < probabilidadIndigestion) {
                pet.enfermedades.push('indigestion');
                pet.felicidad = Math.max(0, pet.felicidad - 8);
            }
        } else {
            pet.felicidad = Math.min(100, pet.felicidad + 12);
            pet.vida = Math.min(100, pet.vida + 8);
            pet.hambre = Math.max(0, pet.hambre - 25);
            pet.energia = Math.min(100, pet.energia + 4);
            pet.peso = Math.min(100, pet.peso + 1);
            let enfermedadesCuradas = false;
            if (pet.enfermedades.includes('gripe')) {
                pet.enfermedades = pet.enfermedades.filter(e => e !== 'gripe');
                enfermedadesCuradas = true;
            }
            if (pet.enfermedades.includes('parasitos')) {
                pet.enfermedades = pet.enfermedades.filter(e => e !== 'parasitos');
                enfermedadesCuradas = true;
            }
            if (pet.enfermedades.includes('indigestion')) {
                pet.enfermedades = pet.enfermedades.filter(e => e !== 'indigestion');
                enfermedadesCuradas = true;
            }
            if (enfermedadesCuradas) recalcularPersonalidad(pet);
        }
        aplicarEfectosEnfermedades(pet);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al alimentar mascota:', error);
        throw error;
    }
}

export async function darAguaPet(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        pet.felicidad = Math.min(100, pet.felicidad + 4);
        pet.vida = Math.min(100, pet.vida + 4);
        pet.sed = Math.max(0, pet.sed - 30);
        pet.energia = Math.min(100, pet.energia + 2);
        aplicarEfectosEnfermedades(pet);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al dar agua:', error);
        throw error;
    }
}

export async function pasearPet(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        pet.felicidad = Math.min(100, pet.felicidad + 15);
        pet.energia = Math.max(0, pet.energia - 8);
        pet.hambre = Math.min(100, pet.hambre + 12);
        pet.sed = Math.min(100, pet.sed + 8);
        let enfermedadesCuradas = false;
        if (pet.enfermedades.includes('sarna')) {
            pet.enfermedades = pet.enfermedades.filter(e => e !== 'sarna');
            enfermedadesCuradas = true;
        }
        if (pet.enfermedades.includes('ansiedad')) {
            pet.enfermedades = pet.enfermedades.filter(e => e !== 'ansiedad');
            enfermedadesCuradas = true;
        }
        if (pet.enfermedades.includes('estres')) {
            pet.enfermedades = pet.enfermedades.filter(e => e !== 'estres');
            enfermedadesCuradas = true;
        }
        if (enfermedadesCuradas) recalcularPersonalidad(pet);
        aplicarEfectosEnfermedades(pet);
        aplicarEfectosPersonalidad(pet);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al pasear mascota:', error);
        throw error;
    }
}

export async function dormirPet(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        pet.energia = Math.min(100, pet.energia + 25);
        pet.felicidad = Math.min(100, pet.felicidad + 8);
        pet.vida = Math.min(100, pet.vida + 4);
        let enfermedadesCuradas = false;
        if (pet.enfermedades.includes('fatiga')) {
            pet.enfermedades = pet.enfermedades.filter(e => e !== 'fatiga');
            enfermedadesCuradas = true;
        }
        if (enfermedadesCuradas) recalcularPersonalidad(pet);
        aplicarEfectosEnfermedades(pet);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al dormir mascota:', error);
        throw error;
    }
}

export async function personalizarPet(id, item) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        pet.items.push(item);
        pet.felicidad = Math.min(100, pet.felicidad + 4);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al personalizar mascota:', error);
        throw error;
    }
}

export async function curarPet(id, enfermedad) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        pet.enfermedades = pet.enfermedades.filter(e => e !== enfermedad);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al curar mascota:', error);
        throw error;
    }
}

export async function hacerEjercicioPet(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        if (!pet) throw new Error('Mascota no encontrada');
        inicializarPropiedadesPou(pet);
        pet.energia = Math.max(0, pet.energia - 15);
        pet.felicidad = Math.min(100, pet.felicidad + 10);
        pet.peso = Math.max(0, pet.peso - 5);
        pet.hambre = Math.min(100, pet.hambre + 20);
        pet.sed = Math.min(100, pet.sed + 15);
        let enfermedadesCuradas = false;
        if (pet.enfermedades.includes('obesidad')) {
            pet.enfermedades = pet.enfermedades.filter(e => e !== 'obesidad');
            enfermedadesCuradas = true;
        }
        if (enfermedadesCuradas) recalcularPersonalidad(pet);
        await petRepository.updatePet(id, pet);
        return pet;
    } catch (error) {
        console.error('Error al hacer ejercicio:', error);
        throw error;
    }
}

// Función para forzar aumento de peso (para testing)
async function forzarAumentoPeso(id, cantidad = 5) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        inicializarPropiedadesPou(pet);
        
        const pesoAnterior = pet.peso;
        pet.peso = Math.min(100, pet.peso + cantidad);
        
        // Si el peso supera 70, alta probabilidad de obesidad
        if (pet.peso > 70 && Math.random() < 0.8) {
            pet.enfermedades.push('obesidad');
            console.log(`🐷 ${pet.nombre} ha desarrollado obesidad! Peso: ${pet.peso}`);
        }
        
        await petRepository.updatePet(id, pet);
        
        return {
            id: pet.id,
            nombre: pet.nombre,
            pesoAnterior: pesoAnterior,
            pesoActual: pet.peso,
            aumento: cantidad,
            enfermedades: pet.enfermedades,
            mensaje: `Peso aumentó de ${pesoAnterior} a ${pet.peso}`
        };
    } catch (error) {
        console.error('Error al forzar aumento de peso:', error);
        throw error;
    }
}

// Obtener estado actualizado con degradación temporal (mejorado)
async function getPetStatus(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        // Inicializar propiedades
        inicializarPropiedadesPou(pet);
        
        // Aplicar degradación temporal
        await degradarEstadisticasTiempo(id);
        
        return pet;
    } catch (error) {
        console.error('Error al obtener estado de mascota:', error);
        throw error;
    }
}

// Función para obtener estadísticas de todas las mascotas (mejorada)
async function getAllPetsStatus() {
    try {
        const pets = await petRepository.getPets();
        const petsActualizados = [];
        
        for (const pet of pets) {
            try {
                // Inicializar propiedades para cada mascota
                inicializarPropiedadesPou(pet);
                const petActualizado = await degradarEstadisticasTiempo(pet.id);
                petsActualizados.push(petActualizado);
            } catch (error) {
                console.error(`Error al procesar mascota ${pet.id}:`, error);
                petsActualizados.push(pet);
            }
        }
        
        return petsActualizados;
    } catch (error) {
        console.error('Error al obtener estado de todas las mascotas:', error);
        throw error;
    }
}

// Función para migrar mascotas existentes al sistema Pou
async function migrarMascotasExistentes() {
    try {
        const pets = await petRepository.getPets();
        let mascotasMigradas = false;
        
        for (const pet of pets) {
            const petOriginal = { ...pet };
            
            // Inicializar propiedades faltantes
            inicializarPropiedadesPou(pet);
            
            // Verificar si se agregaron nuevas propiedades
            if (petOriginal.hambre === undefined || 
                petOriginal.sed === undefined || 
                petOriginal.energia === undefined || 
                petOriginal.ultimaActualizacion === undefined) {
                mascotasMigradas = true;
            }
        }
        
        if (mascotasMigradas) {
            await petRepository.savePets(pets);
            console.log('Mascotas migradas exitosamente al sistema Pou');
        }
        
        return pets;
    } catch (error) {
        console.error('Error al migrar mascotas:', error);
        throw error;
    }
}

// Función para obtener estadísticas del sistema
async function getSistemaStats() {
    try {
        const pets = await getAllPets();
        const stats = {
            totalMascotas: pets.length,
            mascotasSaludables: pets.filter(p => p.vida > 80 && p.felicidad > 80).length,
            mascotasEnfermas: pets.filter(p => p.enfermedades.length > 0).length,
            mascotasHambrientas: pets.filter(p => p.hambre > 70).length,
            mascotasSedientas: pets.filter(p => p.sed > 70).length,
            mascotasCansadas: pets.filter(p => p.energia < 30).length,
            promedioVida: Math.round(pets.reduce((sum, p) => sum + p.vida, 0) / pets.length),
            promedioFelicidad: Math.round(pets.reduce((sum, p) => sum + p.felicidad, 0) / pets.length),
            promedioEnergia: Math.round(pets.reduce((sum, p) => sum + p.energia, 0) / pets.length)
        };
        
        return stats;
    } catch (error) {
        console.error('Error al obtener estadísticas del sistema:', error);
        throw error;
    }
}

// Función para obtener información detallada de peso (para debugging)
async function getPetWeightInfo(id) {
    try {
        id = Number(id);
        const pet = await petRepository.getPetById(id);
        
        if (!pet) {
            throw new Error('Mascota no encontrada');
        }
        
        inicializarPropiedadesPou(pet);
        
        const info = {
            id: pet.id,
            nombre: pet.nombre,
            peso: pet.peso,
            hambre: pet.hambre,
            enfermedades: pet.enfermedades,
            riesgoObesidad: pet.peso > 60 ? 'ALTO' : pet.peso > 40 ? 'MEDIO' : 'BAJO',
            mensaje: `Peso actual: ${pet.peso}/100. ${pet.peso > 60 ? '¡Riesgo de obesidad!' : pet.peso > 40 ? 'Peso normal' : 'Peso bajo'}`
        };
        
        return info;
    } catch (error) {
        console.error('Error al obtener información de peso:', error);
        throw error;
    }
}

export default {
    getAllPets,
    addPet,
    updatePet,
    deletePet,
    alimentarPet,
    darAguaPet,
    pasearPet,
    dormirPet,
    personalizarPet,
    curarPet,
    getPetStatus,
    getAllPetsStatus,
    degradarEstadisticasTiempo,
    degradarEstadisticasForzada,
    migrarMascotasExistentes,
    getSistemaStats,
    forzarRecalculoPersonalidad,
    hacerEjercicioPet,
    getPetWeightInfo,
    forzarAumentoPeso
}; 