import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL];

        if (process.argv.includes('--api')) {
            whiteList.push(undefined); // Permitir solicitudes sin 'origin'
        }

        console.log('Solicitud con Origin:', origin); // Depuración

        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permitir OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir encabezados comunes
    credentials: true // Permitir credenciales (si es necesario)
};