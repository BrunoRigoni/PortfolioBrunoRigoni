// Script para testar a conectividade com Firebase
// Cole este código no console do navegador para testar

async function testFirebaseConnection() {
    console.log('=== TESTE DE CONECTIVIDADE FIREBASE ===');
    
    // Teste 1: Verificar se o Firebase está inicializado
    if (!window.firebaseDb) {
        console.error('❌ Firebase não inicializado');
        return;
    }
    console.log('✅ Firebase inicializado');
    
    // Teste 2: Testar Firestore
    try {
        const projectsCollection = collection(window.firebaseDb, 'projects');
        const querySnapshot = await getDocs(projectsCollection);
        console.log('✅ Firestore funcionando - Projetos encontrados:', querySnapshot.size);
    } catch (error) {
        console.error('❌ Erro no Firestore:', error);
    }
    
    // Teste 3: Testar Authentication
    try {
        if (window.firebaseAuth) {
            console.log('✅ Authentication configurado');
        } else {
            console.error('❌ Authentication não configurado');
        }
    } catch (error) {
        console.error('❌ Erro no Authentication:', error);
    }
    
    console.log('=== FIM DO TESTE ===');
}

// Executar teste automaticamente
testFirebaseConnection();
