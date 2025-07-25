// Configuración de la API
const API_CONFIG = {
    // Cambia esta URL por tu URL de Render cuando la tengas
    // BASE_URL: 'http://localhost:3001',
    BASE_URL: 'https://mascotashappyonline.onrender.com', // Usando tu URL de Render
    ENDPOINTS: {
        // Autenticación
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        PROFILE: '/api/auth/profile',
        
        // Mascotas
        MY_PET: '/api/pets/my-pet',
        FEED: '/api/pets/my-pet/feed',
        WATER: '/api/pets/my-pet/water',
        EXERCISE: '/api/pets/my-pet/exercise',
        STATUS: '/api/pets/my-pet/status',
        
        // Personalización
        CUSTOMIZE: '/api/pets/my-pet/customize',
        ITEMS: '/api/pets/my-pet/items',
        EQUIP_ITEM: '/api/pets/my-pet/items',
        APPEARANCE: '/api/pets/my-pet/appearance'
    }
};

// Estado global de la aplicación
const AppState = {
    authToken: localStorage.getItem('authToken'),
    currentUser: null,
    currentPet: null,
    petItems: []
};

// Clase para manejar las llamadas a la API
class PetAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.endpoints = API_CONFIG.ENDPOINTS;
    }

    // Método genérico para hacer requests
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(AppState.authToken && { 'Authorization': `Bearer ${AppState.authToken}` })
            }
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
            const response = await fetch(url, finalOptions);
            const data = await response.json();
            
            console.log(`📡 API Response:`, { status: response.status, data });
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return { success: true, data, status: response.status };
        } catch (error) {
            console.error(`❌ API Error:`, error);
            return { success: false, error: error.message };
        }
    }

    // Métodos de autenticación
    async register(userData) {
        return await this.makeRequest(this.endpoints.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        return await this.makeRequest(this.endpoints.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async getProfile() {
        return await this.makeRequest(this.endpoints.PROFILE);
    }

    // Métodos de mascota
    async getMyPet() {
        return await this.makeRequest(this.endpoints.MY_PET);
    }

    async createPet(petData) {
        return await this.makeRequest(this.endpoints.MY_PET, {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    }

    async feedPet() {
        return await this.makeRequest(this.endpoints.FEED, {
            method: 'POST'
        });
    }

    async waterPet() {
        return await this.makeRequest(this.endpoints.WATER, {
            method: 'POST'
        });
    }

    async exercisePet() {
        return await this.makeRequest(this.endpoints.EXERCISE, {
            method: 'POST'
        });
    }

    async getPetStatus() {
        return await this.makeRequest(this.endpoints.STATUS);
    }

    // Métodos de personalización
    async addItem(itemData) {
        return await this.makeRequest(this.endpoints.CUSTOMIZE, {
            method: 'POST',
            body: JSON.stringify({ item: itemData })
        });
    }

    async getItems() {
        return await this.makeRequest(this.endpoints.ITEMS);
    }

    async equipItem(itemId, equipped) {
        return await this.makeRequest(`${this.endpoints.EQUIP_ITEM}/${itemId}/equip`, {
            method: 'PUT',
            body: JSON.stringify({ equipado: equipped })
        });
    }

    async deleteItem(itemId) {
        return await this.makeRequest(`${this.endpoints.EQUIP_ITEM}/${itemId}`, {
            method: 'DELETE'
        });
    }

    async getAppearance() {
        return await this.makeRequest(this.endpoints.APPEARANCE);
    }
}

// Instancia global de la API
const api = new PetAPI();

// Funciones de utilidad para el manejo de autenticación
function setAuthToken(token) {
    AppState.authToken = token;
    localStorage.setItem('authToken', token);
}

function clearAuthToken() {
    AppState.authToken = null;
    AppState.currentUser = null;
    AppState.currentPet = null;
    AppState.petItems = [];
    localStorage.removeItem('authToken');
}

function isAuthenticated() {
    return !!AppState.authToken;
}

// Funciones principales de autenticación
async function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!username || !email || !password) {
        showMessage('authMessage', 'Por favor completa todos los campos', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('authMessage', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    showLoading();

    const result = await api.register({ username, email, password });

    if (result.success) {
        setAuthToken(result.data.token);
        AppState.currentUser = result.data.user;
        showMessage('authMessage', result.data.message, 'success');
        setTimeout(() => {
            loadPet();
        }, 1500);
    } else {
        showScreen('authScreen');
        showMessage('authMessage', result.error, 'error');
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage('authMessage', 'Por favor completa todos los campos', 'error');
        return;
    }

    showLoading();

    const result = await api.login({ username, password });

    if (result.success) {
        setAuthToken(result.data.token);
        AppState.currentUser = result.data.user;
        showMessage('authMessage', result.data.message, 'success');
        setTimeout(() => {
            loadPet();
        }, 1500);
    } else {
        showScreen('authScreen');
        showMessage('authMessage', result.error, 'error');
    }
}

async function checkAuth() {
    if (!isAuthenticated()) {
        showScreen('authScreen');
        return false;
    }

    const result = await api.getProfile();

    if (result.success) {
        AppState.currentUser = result.data.user;
        return true;
    } else {
        clearAuthToken();
        showScreen('authScreen');
        return false;
    }
}

function logout() {
    clearAuthToken();
    showScreen('authScreen');
    showMessage('authMessage', 'Sesión cerrada correctamente', 'info');
}

// Funciones de mascota
async function loadPet() {
    showLoading();

    const result = await api.getMyPet();

    if (result.success && result.data.success) {
        AppState.currentPet = result.data.data;
        document.getElementById('username').textContent = AppState.currentUser.username;
        showGameScreen();
        updatePetDisplay();
        await loadPetItems();
    } else {
        // No tiene mascota, mostrar pantalla de crear
        showScreen('createPetScreen');
    }
}

async function createPet() {
    const nombre = document.getElementById('petNameInput').value.trim();
    const tipo = document.getElementById('petTypeInput').value;
    const superpoder = document.getElementById('petPowerInput').value;

    if (!nombre) {
        showMessage('createPetMessage', 'Por favor ingresa un nombre para tu mascota', 'error');
        return;
    }

    if (nombre.length < 2) {
        showMessage('createPetMessage', 'El nombre debe tener al menos 2 caracteres', 'error');
        return;
    }

    showLoading();

    const result = await api.createPet({ nombre, tipo, superpoder });

    if (result.success && result.data.success) {
        AppState.currentPet = result.data.data;
        showMessage('createPetMessage', result.data.message, 'success');
        setTimeout(() => {
            showGameScreen();
            updatePetDisplay();
            loadPetItems();
        }, 2000);
    } else {
        showScreen('createPetScreen');
        showMessage('createPetMessage', result.error, 'error');
    }
}

// Funciones de acciones de la mascota
async function feedPet() {
    await performPetAction('feed', api.feedPet.bind(api), '🍖 Alimentando...');
}

async function waterPet() {
    await performPetAction('water', api.waterPet.bind(api), '💧 Dando agua...');
}

async function exercisePet() {
    await performPetAction('exercise', api.exercisePet.bind(api), '💪 Ejercitando...');
}

async function performPetAction(actionType, apiMethod, loadingText) {
    const actionBtn = event.target.closest('.action-btn');
    const originalHTML = actionBtn.innerHTML;
    
    actionBtn.innerHTML = loadingText;
    actionBtn.disabled = true;

    const result = await apiMethod();

    if (result.success && result.data.success) {
        AppState.currentPet = result.data.data;
        updatePetDisplay();
        showMessage('gameMessage', result.data.message, 'success');
        
        // Animación de la mascota
        animatePet(actionType);
    } else {
        showMessage('gameMessage', result.error, 'error');
    }

    actionBtn.innerHTML = originalHTML;
    actionBtn.disabled = false;
}

async function getDetailedStatus() {
    const result = await api.getPetStatus();

    if (result.success && result.data.success) {
        displayDetailedStatus(result.data.data);
        document.getElementById('statusPanel').classList.remove('hidden');
    } else {
        showMessage('gameMessage', result.error, 'error');
    }
}

// Funciones de personalización
async function loadPetItems() {
    const result = await api.getItems();

    if (result.success && result.data.success) {
        AppState.petItems = result.data.data.items || [];
        updatePetAccessories();
    }
}

async function addItem() {
    const nombre = document.getElementById('itemName').value.trim();
    const tipo = document.getElementById('itemType').value;
    const color = document.getElementById('itemColor').value;
    const descripcion = document.getElementById('itemDescription').value.trim();

    if (!nombre) {
        showMessage('gameMessage', 'Por favor ingresa un nombre para el item', 'error');
        return;
    }

    const result = await api.addItem({ nombre, tipo, color, descripcion });

    if (result.success && result.data.success) {
        // Limpiar formulario
        document.getElementById('itemName').value = '';
        document.getElementById('itemDescription').value = '';
        
        // Recargar items
        await loadPetItems();
        updateItemsList();
        updatePetDisplay();
        
        showMessage('gameMessage', result.data.message, 'success');
    } else {
        showMessage('gameMessage', result.error, 'error');
    }
}

async function toggleEquipItem(itemId, equip) {
    const result = await api.equipItem(itemId, equip);

    if (result.success && result.data.success) {
        await loadPetItems();
        updateItemsList();
        updatePetDisplay();
        showMessage('gameMessage', result.data.message, 'success');
    } else {
        showMessage('gameMessage', result.error, 'error');
    }
}

async function deleteItem(itemId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este item?')) {
        return;
    }

    const result = await api.deleteItem(itemId);

    if (result.success && result.data.success) {
        await loadPetItems();
        updateItemsList();
        updatePetDisplay();
        showMessage('gameMessage', result.data.message, 'success');
    } else {
        showMessage('gameMessage', result.error, 'error');
    }
}

async function viewAppearance() {
    const result = await api.getAppearance();

    if (result.success && result.data.success) {
        displayAppearance(result.data.data);
        document.getElementById('appearancePanel').classList.remove('hidden');
    } else {
        showMessage('gameMessage', result.error, 'error');
    }
}

// Auto-actualización cada 30 segundos
setInterval(async () => {
    if (AppState.currentPet && isAuthenticated()) {
        const result = await api.getMyPet();
        if (result.success && result.data.success) {
            AppState.currentPet = result.data.data;
            updatePetDisplay();
        }
    }
}, 30000);

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Aplicación iniciada');
    
    if (isAuthenticated()) {
        const authValid = await checkAuth();
        if (authValid) {
            await loadPet();
        }
    } else {
        showScreen('authScreen');
    }
});