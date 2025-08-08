# Configuração do Firebase para o Portfólio

Este documento explica como configurar o Firebase para que o sistema de adição de projetos funcione corretamente.

## Serviços Necessários

### 1. Firestore Database
- **Status**: ✅ Gratuito (até 1GB de dados)
- **Função**: Armazenar dados dos projetos (título, descrição, URL, imagem)

### 2. Firebase Authentication
- **Status**: ✅ Gratuito (até 10.000 usuários)
- **Função**: Autenticação do administrador para adicionar projetos

### 3. Firebase Storage
- **Status**: ❌ Requer plano pago (Blaze)
- **Função**: Upload de imagens dos projetos
- **Alternativa**: Usar URLs externas ou hospedar imagens em outro serviço gratuito

## Configuração no Firebase Console

### Passo 1: Acessar o Projeto
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `portfolio-bruno-88fdb`

### Passo 2: Configurar Firestore
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione a localização mais próxima (ex: `us-central1`)

**Regras do Firestore** (temporárias para teste):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Passo 3: Configurar Authentication
1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Em "Sign-in method", habilite "E-mail/senha"
4. Clique em "Adicionar usuário" e crie:
   - **E-mail**: `brigoni2011@gmail.com`
   - **Senha**: `henrique2803!`

### Passo 4: Configurar Domínios Autorizados
1. Em Authentication > Settings > Authorized domains
2. Adicione:
   - `brunorigoni.github.io`
   - `localhost` (para desenvolvimento local)

## Estrutura dos Dados

### Coleção: `projects`
Cada projeto será armazenado como um documento com:
```javascript
{
  title: "Nome do Projeto",
  description: "Descrição do projeto...",
  url: "https://exemplo.com",
  imageUrl: "https://exemplo.com/imagem.jpg",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Solução para Imagens (Sem Firebase Storage)

Como o Firebase Storage requer plano pago, você pode:

1. **Usar URLs externas**: Hospedar imagens em serviços gratuitos como:
   - Imgur
   - Cloudinary (plano gratuito)
   - GitHub (em um repositório separado)

2. **Converter para Base64**: Armazenar imagens pequenas diretamente no Firestore (não recomendado para muitas imagens)

3. **Usar CDN gratuito**: Serviços como jsDelivr ou unpkg

## Debug

### Logs Esperados no Console
Quando o Firebase estiver funcionando, você verá:
```
✅ Firebase inicializado
✅ Firestore conectado
✅ Authentication configurado
✅ Tentando carregar projetos do Firebase...
✅ Encontrados X projetos no Firebase
```

### Teste de Conectividade
Use o script `scripts/firebase-test.js` no console do navegador para testar:
```javascript
// Cole no console do navegador
await testFirebaseConnection();
```

## Comandos para Teste

### Verificar se o Firebase está carregando
```javascript
console.log('Firebase App:', window.firebaseApp);
console.log('Firebase DB:', window.firebaseDb);
console.log('Firebase Auth:', window.firebaseAuth);
```

### Testar leitura do Firestore
```javascript
if (window.firebaseDb) {
  const projectsCollection = collection(window.firebaseDb, 'projects');
  const querySnapshot = await getDocs(projectsCollection);
  console.log('Projetos encontrados:', querySnapshot.size);
}
```

## Problemas Comuns

### 1. "Firebase não inicializado"
- Verifique se `config/firebase-config.js` está sendo carregado
- Confirme que não há erros de JavaScript no console

### 2. "Permissão negada"
- Verifique as regras do Firestore
- Confirme se o domínio está autorizado

### 3. "Usuário não autenticado"
- Verifique se o usuário foi criado no Authentication
- Confirme se as credenciais estão corretas

### 4. Projetos não aparecem
- Verifique se há dados na coleção `projects`
- Confirme se as regras do Firestore permitem leitura

## Próximos Passos

1. **Teste local**: Abra `index.html` em um servidor local
2. **Verifique o console**: Procure por mensagens de erro
3. **Teste a autenticação**: Tente fazer login com as credenciais
4. **Verifique o Firestore**: Confirme se os dados estão sendo salvos
5. **Teste no GitHub Pages**: Deploy e teste em produção

## Nota sobre Custos

- **Firestore**: Gratuito até 1GB de dados
- **Authentication**: Gratuito até 10.000 usuários
- **Storage**: Requer plano Blaze (pago)
- **Hosting**: Gratuito até 10GB de transferência

Para um portfólio pessoal, o plano gratuito do Firestore e Authentication é mais que suficiente.
