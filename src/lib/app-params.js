export const appParams = {
    appId: import.meta.env.VITE_BASE44_APP_ID || 'demo-app',
    token: null, // пока токена нет
    fromUrl: window.location.href,
    functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1',
    appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || 'http://localhost:3000',
};