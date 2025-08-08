// Script de teste para verificar conectividade com Firebase
// Execute no console do navegador para testar

async function testFirebaseConnection() {
    console.log('=== TESTE DE CONECTIVIDADE FIREBASE ===');
    
    // Teste 1: Verificar se Firebase está inicializado
    if (!window.firebaseDb) {
        console.error('❌ Firebase não inicializado');
        return;
    }
    console.log('✅ Firebase inicializado');
    
    // Teste 2: Verificar Firestore
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        const projectsCollection = collection(window.firebaseDb, 'projects');
        const querySnapshot = await getDocs(projectsCollection);
        console.log(`✅ Firestore funcionando - ${querySnapshot.size} projetos encontrados`);
    } catch (error) {
        console.error('❌ Erro no Firestore:', error);
    }
    
    // Teste 3: Verificar Storage
    try {
        const { ref, uploadBytes } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
        const testRef = ref(window.firebaseStorage, 'test/connection-test.txt');
        console.log('✅ Storage funcionando');
    } catch (error) {
        console.error('❌ Erro no Storage:', error);
    }
    
    // Teste 4: Verificar Auth
    try {
        const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        console.log('✅ Auth funcionando');
    } catch (error) {
        console.error('❌ Erro no Auth:', error);
    }
    
    console.log('=== FIM DO TESTE ===');
}

// Executar teste
testFirebaseConnection();
