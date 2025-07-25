console.log('🎮 game.js cargado');

// Lógica principal del juego
class GameManager {
    constructor() {
        this.gameState = {
            isPlaying: false,
            lastUpdate: null
        };
    }

    // Inicializar el juego
    init() {
        console.log('🎮 GameManager inicializado');
        this.setupKeyboardShortcuts();
    }

    // Configurar atajos de teclado
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Solo funcionar si estamos en la pantalla del juego
            if (!document.getElementById('gameScreen').classList.contains('active')) {
                return;
            }

            switch (event.key.toLowerCase()) {
                case 'f':
                    event.preventDefault();
                    if (typeof feedPet === 'function') feedPet();
                    break;
                case 'w':
                    event.preventDefault();
                    if (typeof waterPet === 'function') waterPet();
                    break;
                case 'e':
                    event.preventDefault();
                    if (typeof exercisePet === 'function') exercisePet();
                    break;
                case 's':
                    event.preventDefault();
                    if (typeof getDetailedStatus === 'function') getDetailedStatus();
                    break;
                case 'c':
                    event.preventDefault();
                    if (typeof openCustomize === 'function') openCustomize();
                    break;
                case 'escape':
                    event.preventDefault();
                    this.closeAllModals();
                    break;
            }
        });
    }

    // Cerrar todos los modales
    closeAllModals() {
        const modals = ['customizePanel', 'statusPanel', 'appearancePanel'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Calcular recomendaciones para el cuidado de la mascota
    getPetCareRecommendations(pet) {
        const recommendations = [];

        if (pet.hambre > 60) {
            recommendations.push({
                action: 'feed',
                priority: 'high',
                message: '🍖 Tu mascota tiene mucha hambre',
                emoji: '🍖'
            });
        }

        if (pet.sed > 60) {
            recommendations.push({
                action: 'water',
                priority: 'high',
                message: '💧 Tu mascota tiene mucha sed',
                emoji: '💧'
            });
        }

        if (pet.energia < 30) {
            recommendations.push({
                action: 'rest',
                priority: 'medium',
                message: '😴 Tu mascota necesita descansar',
                emoji: '😴'
            });
        }

        if (pet.peso > 80) {
            recommendations.push({
                action: 'exercise',
                priority: 'medium',
                message: '🏃 Tu mascota necesita ejercicio',
                emoji: '🏃'
            });
        }

        if (pet.felicidad < 40) {
            recommendations.push({
                action: 'play',
                priority: 'medium',
                message: '🎾 Tu mascota necesita atención y juego',
                emoji: '🎾'
            });
        }

        if (pet.vida < 50) {
            recommendations.push({
                action: 'health',
                priority: 'high',
                message: '🏥 Tu mascota necesita cuidados médicos',
                emoji: '🏥'
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    // Calcular nivel de la mascota basado en cuidados
    calculatePetLevel(pet) {
        const totalCare = pet.felicidad + pet.vida + pet.energia + (100 - pet.hambre) + (100 - pet.sed);
        const averageCare = totalCare / 5;
        
        if (averageCare >= 90) return { level: 5, title: 'Maestro Cuidador' };
        if (averageCare >= 75) return { level: 4, title: 'Cuidador Experto' };
        if (averageCare >= 60) return { level: 3, title: 'Buen Cuidador' };
        if (averageCare >= 40) return { level: 2, title: 'Cuidador Novato' };
        return { level: 1, title: 'Principiante' };
    }

    // Actualizar personalidad basada en estadísticas
    updatePersonality(pet) {
        if (pet.felicidad >= 80 && pet.energia >= 70) {
            pet.personalidad = 'alegre';
        } else if (pet.felicidad < 30) {
            pet.personalidad = 'triste';
        } else if (pet.energia >= 80) {
            pet.personalidad = 'energético';
        } else if (pet.hambre > 70 || pet.sed > 70) {
            pet.personalidad = 'nervioso';
        } else {
            pet.personalidad = 'normal';
        }
    }
}

// Instancia global del game manager
const gameManager = new GameManager();

// Funciones de utilidad para debugging
window.gameDebug = {
    getPet: () => AppState.currentPet,
    getRecommendations: () => gameManager.getPetCareRecommendations(AppState.currentPet),
    updatePersonality: () => {
        if (AppState.currentPet) {
            gameManager.updatePersonality(AppState.currentPet);
            updatePetDisplay();
        }
    }
};

// Inicializar game manager cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    gameManager.init();
});

console.log('🎮 game.js completamente cargado');