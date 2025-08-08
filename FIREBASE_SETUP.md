# Configuração do Firebase para o Portfolio

## 🔥 Configurações Necessárias no Firebase Console

### 1. **Firestore Database**
- Acesse: https://console.firebase.google.com/project/portfolio-bruno-88fdb/firestore
- **Criar banco de dados** se não existir
- **Regras de segurança** (modo de teste por 30 dias):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // PERMITIR TUDO PARA TESTE
    }
  }
}
```

### 2. **Storage**
- Acesse: https://console.firebase.google.com/project/portfolio-bruno-88fdb/storage
- **Criar bucket** se não existir
- **Regras de segurança** (modo de teste por 30 dias):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // PERMITIR TUDO PARA TESTE
    }
  }
}
```

### 3. **Authentication**
- Acesse: https://console.firebase.google.com/project/portfolio-bruno-88fdb/authentication
- **Habilitar Email/Password** como método de autenticação
- **Criar usuário** para login:
  - Email: `brigoni2011@gmail.com`
  - Senha: `henrique2803!`

### 4. **Configurações do Projeto**
- Acesse: https://console.firebase.google.com/project/portfolio-bruno-88fdb/settings/general
- Verificar se as configurações estão corretas:
  ```javascript
  const firebaseConfig = {
    apiKey: "AIzaSyAcr4YN7O5FM_NAZyqFVDx9Aat-saVRRMU",
    authDomain: "portfolio-bruno-88fdb.firebaseapp.com",
    projectId: "portfolio-bruno-88fdb",
    storageBucket: "portfolio-bruno-88fdb.firebasestorage.app",
    messagingSenderId: "31520496865",
    appId: "1:31520496865:web:cdcc3f1e21ec914912aba0",
    measurementId: "G-SHQBQF66QM"
  };
  ```

### 5. **Domínios Autorizados**
- Acesse: https://console.firebase.google.com/project/portfolio-bruno-88fdb/authentication/settings
- **Adicionar domínio**: `brunorigoni.github.io`
- **Adicionar domínio**: `localhost` (para testes locais)

## 🚨 Problemas Comuns e Soluções

### 1. **Erro de CORS**
- Adicionar domínio no Firebase Console:
  - Settings > General > Your apps > Add app > Web app
  - Adicionar: `https://brunorigoni.github.io`

### 2. **Erro de Permissões**
- Verificar se as regras do Firestore e Storage estão configuradas
- Temporariamente usar regras permissivas para teste

### 3. **Erro de Autenticação**
- Verificar se o usuário foi criado no Authentication
- Verificar se Email/Password está habilitado

### 4. **Erro de Storage**
- Verificar se o bucket foi criado
- Verificar regras de segurança do Storage

### 5. **Erro de Firestore**
- Verificar se o banco de dados foi criado
- Verificar regras de segurança do Firestore

## 🔍 Debug

### Console do Navegador
Abra o console (F12) e verifique:
1. **Inicialização do Firebase**: Deve mostrar "Firebase configurado e exportado"
2. **Carregamento de projetos**: Deve mostrar "Encontrados X projetos"
3. **Adição de projeto**: Deve mostrar logs de upload e salvamento

### Logs Esperados
```
Inicializando Firebase...
Firebase App inicializado: [object Object]
Firebase Analytics inicializado: [object Object]
Firebase Firestore inicializado: [object Object]
Firebase Storage inicializado: [object Object]
Firebase Auth inicializado: [object Object]
Firebase configurado e exportado para window: {firebaseApp: true, firebaseDb: true, firebaseStorage: true, firebaseAuth: true}
Tentando carregar projetos do Firebase...
Firebase DB encontrado, buscando projetos...
Encontrados 0 projetos no Firebase
```

### Teste de Conectividade
Execute no console do navegador:
```javascript
// Copie e cole o conteúdo do arquivo scripts/firebase-test.js
```

## 📝 Próximos Passos

1. **Configurar Firebase Console** seguindo os passos acima
2. **Testar no GitHub Pages** com console aberto
3. **Verificar logs** para identificar problemas específicos
4. **Ajustar regras de segurança** conforme necessário
5. **Remover logs de debug** após funcionamento

## 🔧 Comandos para Teste

### Teste Local
```bash
# Servidor local para teste
python -m http.server 8000
# ou
npx serve .
```

### Teste no GitHub Pages
1. Fazer commit das alterações
2. Push para o repositório
3. Verificar se GitHub Pages está ativo
4. Testar em: `https://brunorigoni.github.io/PortifolioBrunoRigoni`

## 📞 Suporte

Se ainda houver problemas:
1. Verificar console do navegador (F12)
2. Verificar Network tab para erros de requisição
3. Verificar se todas as configurações do Firebase estão corretas
4. Testar com regras permissivas temporariamente
