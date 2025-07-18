#!/usr/bin/env node

// Script de inicio para Render
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Iniciando servidor Pou Pets API...');
console.log('📁 Directorio actual:', __dirname);

// Cambiar al directorio api-superheroes y ejecutar la aplicación
const appPath = join(__dirname, 'api-superheroes', 'app.js');
console.log('📂 Ejecutando:', appPath);

// Ejecutar node app.js directamente
const child = spawn('node', [appPath], {
    cwd: join(__dirname, 'api-superheroes'),
    stdio: 'inherit',
    env: { ...process.env }
});

child.on('error', (error) => {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
});

child.on('exit', (code) => {
    console.log(`🔄 Aplicación terminó con código: ${code}`);
    process.exit(code);
});