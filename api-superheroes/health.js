// Archivo de diagnóstico para verificar el estado de la aplicación
import mongoose from 'mongoose';

export function getHealthStatus() {
    return {
        timestamp: new Date().toISOString(),
        status: 'running',
        mongodb: {
            connected: mongoose.connection.readyState === 1,
            state: getMongooseState(mongoose.connection.readyState)
        },
        environment: {
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET
        }
    };
}

function getMongooseState(state) {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    return states[state] || 'unknown';
}