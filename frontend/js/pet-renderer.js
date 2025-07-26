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

        // Aplicar estilo según el tipo de mascota
        this.petElement.classList.add(`pet-${pet.tipo}`);

        // Determinar estado emocional y aplicar clases
        const emotionalStateSpanish = this.getEmotionalState(pet);
        let emotionalState = 'normal';
        
        // Mapear estados en español a clases CSS en inglés
        const stateMapping = {
            'enfermo': 'sick',
            'feliz': 'happy', 
            'triste': 'sad',
            'normal': 'normal'
        };
        
        emotionalState = stateMapping[emotionalStateSpanish] || 'normal';
        
        if (emotionalState !== 'normal') {
            this.petElement.classList.add(emotionalState);
            this.mouthElement.classList.add(emotionalState);
        }

        // Actualizar ojos según el estado
        this.updateEyes(emotionalState);

        // Actualizar características específicas del tipo
        this.updatePetTypeFeatures(pet);

        // Actualizar accesorios
        this.renderAccessories();
    }

    // Actualizar expresión de los ojos
    updateEyes(emotionalState) {
        const eyes = this.petElement.querySelectorAll('.eye');
        
        eyes.forEach(eye => {
            // Resetear clases de ojos
            eye.className = 'eye';
            
            // Aplicar clase según estado emocional
            eye.classList.add(`eye-${emotionalState}`);
        });
    }

    // Actualizar características específicas según el tipo de mascota
    updatePetTypeFeatures(pet) {
        if (!this.petElement || !pet) return;

        // Limpiar características anteriores
        const existingFeatures = this.petElement.querySelectorAll('.pet-feature');
        existingFeatures.forEach(feature => feature.remove());

        // Agregar características según el tipo
        switch (pet.tipo) {
            case 'perro':
                this.addDogFeatures();
                break;
            case 'gato':
                this.addCatFeatures();
                break;
            case 'conejo':
                this.addRabbitFeatures();
                break;
            case 'hamster':
                this.addHamsterFeatures();
                break;
            case 'pez':
                this.addFishFeatures();
                break;
        }
    }

    // Características específicas para perro
    addDogFeatures() {
        // Orejas de perro
        const leftEar = document.createElement('div');
        leftEar.className = 'pet-feature dog-ear left';
        this.petElement.appendChild(leftEar);

        const rightEar = document.createElement('div');
        rightEar.className = 'pet-feature dog-ear right';
        this.petElement.appendChild(rightEar);

        // Nariz de perro
        const nose = document.createElement('div');
        nose.className = 'pet-feature dog-nose';
        this.petElement.appendChild(nose);

        // Cola de perro
        const tail = document.createElement('div');
        tail.className = 'pet-feature dog-tail';
        this.petElement.appendChild(tail);
    }

    // Características específicas para gato
    addCatFeatures() {
        // Orejas de gato (triangulares)
        const leftEar = document.createElement('div');
        leftEar.className = 'pet-feature cat-ear left';
        this.petElement.appendChild(leftEar);

        const rightEar = document.createElement('div');
        rightEar.className = 'pet-feature cat-ear right';
        this.petElement.appendChild(rightEar);

        // Bigotes
        const whiskers = document.createElement('div');
        whiskers.className = 'pet-feature cat-whiskers';
        whiskers.innerHTML = `
            <div class="whisker left-1"></div>
            <div class="whisker left-2"></div>
            <div class="whisker right-1"></div>
            <div class="whisker right-2"></div>
        `;
        this.petElement.appendChild(whiskers);

        // Cola de gato
        const tail = document.createElement('div');
        tail.className = 'pet-feature cat-tail';
        this.petElement.appendChild(tail);
    }

    // Características específicas para conejo
    addRabbitFeatures() {
        // Orejas largas de conejo
        const leftEar = document.createElement('div');
        leftEar.className = 'pet-feature rabbit-ear left';
        this.petElement.appendChild(leftEar);

        const rightEar = document.createElement('div');
        rightEar.className = 'pet-feature rabbit-ear right';
        this.petElement.appendChild(rightEar);

        // Nariz de conejo
        const nose = document.createElement('div');
        nose.className = 'pet-feature rabbit-nose';
        this.petElement.appendChild(nose);

        // Cola pequeña
        const tail = document.createElement('div');
        tail.className = 'pet-feature rabbit-tail';
        this.petElement.appendChild(tail);
    }

    // Características específicas para hámster
    addHamsterFeatures() {
        // Orejas pequeñas y redondas
        const leftEar = document.createElement('div');
        leftEar.className = 'pet-feature hamster-ear left';
        this.petElement.appendChild(leftEar);

        const rightEar = document.createElement('div');
        rightEar.className = 'pet-feature hamster-ear right';
        this.petElement.appendChild(rightEar);

        // Mejillas infladas
        const leftCheek = document.createElement('div');
        leftCheek.className = 'pet-feature hamster-cheek left';
        this.petElement.appendChild(leftCheek);

        const rightCheek = document.createElement('div');
        rightCheek.className = 'pet-feature hamster-cheek right';
        this.petElement.appendChild(rightCheek);

        // Cola muy pequeña
        const tail = document.createElement('div');
        tail.className = 'pet-feature hamster-tail';
        this.petElement.appendChild(tail);
    }

    // Características específicas para pez
    addFishFeatures() {
        // Aletas laterales
        const leftFin = document.createElement('div');
        leftFin.className = 'pet-feature fish-fin left';
        this.petElement.appendChild(leftFin);

        const rightFin = document.createElement('div');
        rightFin.className = 'pet-feature fish-fin right';
        this.petElement.appendChild(rightFin);

        // Aleta dorsal (arriba)
        const dorsalFin = document.createElement('div');
        dorsalFin.className = 'pet-feature fish-dorsal-fin';
        this.petElement.appendChild(dorsalFin);

        // Cola de pez
        const tail = document.createElement('div');
        tail.className = 'pet-feature fish-tail';
        this.petElement.appendChild(tail);

        // Escamas decorativas
        const scales = document.createElement('div');
        scales.className = 'pet-feature fish-scales';
        scales.innerHTML = `
            <div class="scale scale-1"></div>
            <div class="scale scale-2"></div>
            <div class="scale scale-3"></div>
        `;
        this.petElement.appendChild(scales);

        // Burbujas (efecto acuático)
        const bubbles = document.createElement('div');
        bubbles.className = 'pet-feature fish-bubbles';
        bubbles.innerHTML = `
            <div class="bubble bubble-1"></div>
            <div class="bubble bubble-2"></div>
            <div class="bubble bubble-3"></div>
        `;
        this.petElement.appendChild(bubbles);
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
        
        // Mostrar estado emocional en lugar de personalidad
        if (elements.petPersonality) {
            const emotionalState = this.getEmotionalState(pet);
            const stateEmojis = {
                'feliz': '😊 Feliz',
                'triste': '😢 Triste', 
                'enfermo': '🤒 Enfermo',
                'normal': '😐 Normal'
            };
            elements.petPersonality.textContent = stateEmojis[emotionalState] || '😐 Normal';
        }
    }

    // Determinar el estado emocional basado en las estadísticas
    getEmotionalState(pet) {
        if (pet.vida < 30) {
            return 'enfermo';
        } else if (pet.felicidad >= 70) {
            return 'feliz';
        } else if (pet.felicidad < 30) {
            return 'triste';
        } else {
            return 'normal';
        }
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