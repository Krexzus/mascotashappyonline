console.log('🐾 pet-renderer.js cargado');

// Renderizador de la mascota y sus accesorios
class PetRenderer {
    constructor() {
        this.petElement = null;
        this.accessoriesContainer = null;
        this.mouthElement = null;
    }

    init() {
        this.petElement = document.getElementById('pet');
        this.accessoriesContainer = document.getElementById('petAccessories');
        this.mouthElement = document.getElementById('petMouth');
        console.log('🐾 PetRenderer inicializado');
    }

    // Actualizar la apariencia de la mascota basada en sus estadísticas
    updatePetAppearance(pet) {
        if (!this.petElement || !pet) return;

        // Resetear clases
        this.petElement.className = 'pet';
        this.mouthElement.className = 'mouth';

        // Cambiar apariencia según felicidad
        if (pet.felicidad >= 70) {
            this.petElement.classList.add('happy');
        } else if (pet.felicidad < 30) {
            this.petElement.classList.add('sad');
            this.mouthElement.classList.add('sad');
        }

        if (pet.vida < 30) {
            this.petElement.classList.add('sick');
        }

        // Actualizar accesorios
        this.renderAccessories();
    }

    // Renderizar accesorios equipados
    renderAccessories() {
        if (!this.accessoriesContainer) return;

        // Limpiar accesorios existentes
        this.accessoriesContainer.innerHTML = '';

        // Obtener items equipados
        if (AppState.petItems && AppState.petItems.length > 0) {
            const equippedItems = AppState.petItems.filter(item => item.equipado);
            
            equippedItems.forEach(item => {
                const accessory = this.createAccessoryElement(item);
                this.accessoriesContainer.appendChild(accessory);
            });
        }
    }

    // Crear elemento de accesorio
    createAccessoryElement(item) {
        const accessory = document.createElement('div');
        accessory.className = `accessory ${item.tipo}`;
        accessory.style.setProperty('--color', item.color);
        return accessory;
    }

    // Animar la mascota según la acción realizada
    animatePet(actionType) {
        if (!this.petElement) return;

        // Remover animaciones existentes
        this.petElement.style.animation = '';

        // Aplicar animación según la acción
        switch (actionType) {
            case 'feed':
                this.petElement.style.animation = 'bounce 0.6s ease-in-out';
                break;
            case 'water':
                this.petElement.style.animation = 'bounce 0.6s ease-in-out';
                break;
            case 'exercise':
                this.petElement.style.animation = 'shake 0.8s ease-in-out';
                break;
            case 'click':
                this.petElement.style.animation = 'bounce 0.4s ease-in-out';
                break;
        }

        // Restaurar animación de flotación después de un tiempo
        setTimeout(() => {
            this.petElement.style.animation = 'float 3s ease-in-out infinite';
        }, 1000);
    }

    // Actualizar información de la mascota en la UI
    updatePetInfo(pet) {
        const elements = {
            petName: document.getElementById('petName'),
            petType: document.getElementById('petType'),
            petPersonality: document.getElementById('petPersonality')
        };

        if (elements.petName) elements.petName.textContent = pet.nombre;
        if (elements.petType) elements.petType.textContent = pet.tipo;
        if (elements.petPersonality) elements.petPersonality.textContent = pet.personalidad;
    }

    // Actualizar barras de estadísticas
    updateStats(pet) {
        const stats = ['felicidad', 'vida', 'energia', 'hambre', 'sed', 'peso'];
        
        stats.forEach(stat => {
            const valueElement = document.getElementById(`${stat}Value`);
            const barElement = document.getElementById(`${stat}Bar`);
            
            if (valueElement && barElement) {
                const value = pet[stat] || 0;
                valueElement.textContent = Math.round(value);
                barElement.style.width = `${Math.max(0, Math.min(100, value))}%`;
            }
        });
    }
}

// Instancia global del renderizador
const petRenderer = new PetRenderer();

// Función global para animar la mascota (llamada desde api.js)
function animatePet(actionType) {
    petRenderer.animatePet(actionType);
}

// Función para el click en la mascota
function petClick() {
    if (!AppState.currentPet) return;
    
    animatePet('click');
    
    // Mensajes aleatorios
    const messages = [
        '¡Tu mascota te saluda! 👋',
        '¡Le gusta que la toques! 😊',
        '¡Está muy feliz contigo! 💖',
        '¡Quiere jugar! 🎾',
        '¡Te ama mucho! 💕',
        '¡Ronronea de felicidad! 😸',
        '¡Mueve la cola! 🐕',
        '¡Salta de alegría! 🦘'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showMessage('gameMessage', randomMessage, 'success');
}

// Función para actualizar toda la información de la mascota
function updatePetDisplay() {
    if (!AppState.currentPet) return;
    
    const pet = AppState.currentPet;
    
    // Actualizar renderizador
    petRenderer.updatePetAppearance(pet);
    petRenderer.updatePetInfo(pet);
    petRenderer.updateStats(pet);
}

// Inicializar el renderizador cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    petRenderer.init();
});

console.log('🐾 pet-renderer.js completamente cargado');