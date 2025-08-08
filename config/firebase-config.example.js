// Configuração do Firebase - ARQUIVO DE EXEMPLO
// ATENÇÃO: Este arquivo deve ser renomeado para firebase-config.js e configurado com suas credenciais reais
// Em produção, essas credenciais devem ser gerenciadas de forma segura

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// SUBSTITUA ESTAS CONFIGURAÇÕES PELAS SUAS REAIS
const firebaseConfig = {
  apiKey: "AIzaSyAcr4YN7O5FM_NAZyqFVDx9Aat-saVRRMU",
  authDomain: "portfolio-bruno-88fdb.firebaseapp.com",
  projectId: "portfolio-bruno-88fdb",
  storageBucket: "portfolio-bruno-88fdb.firebasestorage.app",
  messagingSenderId: "31520496865",
  appId: "1:31520496865:web:cdcc3f1e21ec914912aba0",
  measurementId: "G-SHQBQF66QM"
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
