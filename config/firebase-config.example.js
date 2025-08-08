// Configuração do Firebase - ARQUIVO DE EXEMPLO
// ATENÇÃO: Este arquivo deve ser renomeado para firebase-config.js e configurado com suas credenciais reais
// Em produção, essas credenciais devem ser gerenciadas de forma segura

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// SUBSTITUA ESTAS CONFIGURAÇÕES PELAS SUAS REAIS
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar para uso global
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;
window.firebaseAnalytics = analytics;

console.log('✅ Firebase configurado e exportado para window:', {
    firebaseApp: !!window.firebaseApp,
    firebaseDb: !!window.firebaseDb,
    firebaseAuth: !!window.firebaseAuth,
    firebaseAnalytics: !!window.firebaseAnalytics
});
