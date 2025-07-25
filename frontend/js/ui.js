console.log('🖥️ ui.js cargado');

// Funciones de manejo de pantallas
function showScreen(screenId) {
    console.log(`🖥️ Cambiando a pantalla: ${screenId}`);
    
    // Ocultar todas las pantallas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    // Mostrar la pantalla solicitada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
    }
}

function showGameScreen() {
    showScreen('gameScreen');
}

function showLoading() {
    showScreen('loadingScreen');
}

// Funciones de mensajes
function showMessage(elementId, message, type = 'success') {
    const messageEl = document.getElementById(elementId);
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 5000);
}

// Funciones de autenticación UI
function toggleAuthMode() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
    
    // Limpiar campos
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
}

// Funciones de personalización UI
function openCustomize() {
    if (typeof loadPetItems === 'function') {
        loadPetItems().then(() => {
            updateItemsList();
            document.getElementById('customizePanel').classList.remove('hidden');
        });
    } else {
        document.getElementById('customizePanel').classList.remove('hidden');
    }
}

function closeCustomize() {
    document.getElementById('customizePanel').classList.add('hidden');
}

function updateItemsList() {
    const itemsList = document.getElementById('itemsList');
    if (!itemsList) return;

    itemsList.innerHTML = '';

    if (!AppState.petItems || AppState.petItems.length === 0) {
        itemsList.innerHTML = `
            <div class="text-center" style="padding: 20px; color: #666;">
                <p>🎨 No tienes items aún</p>
                <p style="font-size: 14px; margin-top: 10px;">Crea tu primer accesorio usando el formulario de arriba</p>
            </div>
        `;
        return;
    }

    console.log("DEBUG items:", AppState.petItems); // <-- Debug log

    AppState.petItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = `item-card ${item.equipado ? 'equipped' : ''}`;
        
        itemCard.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.nombre}</div>
                <div class="item-type">${item.tipo}</div>
                ${item.descripcion ? `<div style="font-size: 11px; color: #888; margin-top: 2px;">${item.descripcion}</div>` : ''}
            </div>
            <div class="item-color" style="background-color: ${item.color};"></div>
            <div class="item-actions">
                <button class="item-btn ${item.equipado ? 'unequip-btn' : 'equip-btn'}" 
                        onclick="toggleEquipItem('${item._id}', ${!item.equipado})">
                    ${item.equipado ? 'Quitar' : 'Equipar'}
                </button>
                <button class="item-btn delete-btn" onclick="deleteItem('${item._id}')">
                    🗑️
                </button>
            </div>
        `;
        
        itemsList.appendChild(itemCard);
    });
}

// Funciones de estado detallado
function closeStatus() {
    document.getElementById('statusPanel').classList.add('hidden');
}

function displayDetailedStatus(statusData) {
    const statusContent = document.getElementById('statusContent');
    if (!statusContent) return;

    const { mascota, estadoGeneral, necesidades, recomendaciones } = statusData;
    
    statusContent.innerHTML = `
        <div class="status-section">
            <h4>📊 Estado General</h4>
            <div class="status-item">
                <span>Evaluación:</span>
                <span style="font-weight: bold;">${estadoGeneral}</span>
            </div>
        </div>

        <div class="status-section">
            <h4>🔍 Necesidades Actuales</h4>
            <div class="status-item">
                <span>🍖 Hambre:</span>
                <span>${necesidades.hambre}</span>
            </div>
            <div class="status-item">
                <span>💧 Sed:</span>
                <span>${necesidades.sed}</span>
            </div>
            <div class="status-item">
                <span>⚡ Energía:</span>
                <span>${necesidades.energia}</span>
            </div>
            <div class="status-item">
                <span>😊 Felicidad:</span>
                <span>${necesidades.felicidad}</span>
            </div>
        </div>

        <div class="status-section">
            <h4>📈 Estadísticas Detalladas</h4>
            <div class="status-item">
                <span>❤️ Vida:</span>
                <span>${mascota.vida}/100</span>
            </div>
            <div class="status-item">
                <span>⚖️ Peso:</span>
                <span>${mascota.peso}/100</span>
            </div>
            <div class="status-item">
                <span>🎭 Personalidad:</span>
                <span style="text-transform: capitalize;">${mascota.personalidad}</span>
            </div>
            <div class="status-item">
                <span>🦸 Superpoder:</span>
                <span style="text-transform: capitalize;">${mascota.superpoder}</span>
            </div>
        </div>

        ${recomendaciones.length > 0 ? `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 15px;">
                <h4 style="color: #856404; margin-bottom: 10px;">💡 Recomendaciones</h4>
                <ul style="list-style: none; padding: 0;">
                    ${recomendaciones.map(rec => `<li style="padding: 5px 0; color: #856404;">${rec}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <div class="status-section">
            <h4>⏰ Información Temporal</h4>
            <div class="status-item">
                <span>Última actualización:</span>
                <span>${new Date(mascota.ultimaActualizacion).toLocaleString()}</span>
            </div>
        </div>
    `;
}

// Funciones de apariencia
function closeAppearance() {
    document.getElementById('appearancePanel').classList.add('hidden');
}

function displayAppearance(appearanceData) {
    const appearanceContent = document.getElementById('appearanceContent');
    if (!appearanceContent) return;

    const { nombre, tipo, personalidad, itemsEquipados, descripcion } = appearanceData;
    
    appearanceContent.innerHTML = `
        <div class="status-section">
            <h4>👀 Apariencia Actual</h4>
            <div class="status-item">
                <span>Nombre:</span>
                <span style="font-weight: bold;">${nombre}</span>
            </div>
            <div class="status-item">
                <span>Tipo:</span>
                <span style="text-transform: capitalize;">${tipo}</span>
            </div>
            <div class="status-item">
                <span>Personalidad:</span>
                <span style="text-transform: capitalize;">${personalidad}</span>
            </div>
        </div>

        <div class="status-section">
            <h4>🎨 Accesorios Equipados</h4>
            ${itemsEquipados.length > 0 ? `
                <div style="display: grid; gap: 10px;">
                    ${itemsEquipados.map(item => `
                        <div class="item-card equipped">
                            <div class="item-info">
                                <div class="item-name">${item.nombre}</div>
                                <div class="item-type">${item.tipo}</div>
                            </div>
                            <div class="item-color" style="background-color: ${item.color};"></div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <p style="color: #666; text-align: center; padding: 20px;">
                    No tienes accesorios equipados
                </p>
            `}
        </div>

        <div class="status-section">
            <h4>📝 Descripción</h4>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 10px; line-height: 1.5;">
                ${descripcion}
            </p>
        </div>
    `;
}

// Funciones de utilidad UI
function updatePetAccessories() {
    if (typeof petRenderer !== 'undefined' && petRenderer.renderAccessories) {
        petRenderer.renderAccessories();
    }
}

// Cerrar modales al hacer clic fuera de ellos
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.add('hidden');
    }
});

// Manejar tecla Escape para cerrar modales
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});

console.log('🖥️ ui.js completamente cargado');