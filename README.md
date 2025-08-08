# Portfólio Bruno Henrique Rigoni

Portfólio pessoal desenvolvido com HTML, CSS e JavaScript, integrado ao Firebase para gerenciamento de projetos.

## 🚀 Funcionalidades

- **Design Moderno**: Tema dark com efeitos glassmorphism
- **Sistema de Autenticação**: Login administrativo para adicionar projetos
- **Gerenciamento de Projetos**: Adicionar, visualizar e gerenciar projetos do portfólio
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Integração Firebase**: Firestore para dados e Authentication para login

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Firestore (gratuito)
- **Autenticação**: Firebase Authentication (gratuito)
- **Deploy**: GitHub Pages

## 📋 Pré-requisitos

- Conta no Firebase (gratuita)
- Navegador moderno com suporte a ES6 modules
- Git para versionamento

## ⚙️ Configuração

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/PortifolioBrunoRigoni.git
cd PortifolioBrunoRigoni
```

### 2. Configure o Firebase

#### 2.1 Crie um Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome: `portfolio-bruno-88fdb` (ou outro nome)
4. Siga os passos de configuração

#### 2.2 Configure o Firestore
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste"
4. Selecione localização (ex: `us-central1`)

**Regras temporárias** (para desenvolvimento):
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

#### 2.3 Configure o Authentication
1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Habilite "E-mail/senha"
4. Crie usuário:
   - **E-mail**: `brigoni2011@gmail.com`
   - **Senha**: `henrique2803!`

#### 2.4 Configure Domínios Autorizados
1. Em Authentication > Settings > Authorized domains
2. Adicione:
   - `brunorigoni.github.io`
   - `localhost`

### 3. Configure as Credenciais
1. Copie o arquivo `config/firebase-config.example.js` para `config/firebase-config.js`
2. Substitua as configurações pelas suas do Firebase Console
3. **IMPORTANTE**: Adicione `config/firebase-config.js` ao `.gitignore`

### 4. Teste Localmente
```bash
# Servidor local simples
python -m http.server 8000
# ou
npx serve .
```

## 📱 Como Usar

### Visualizar o Portfólio
1. Abra `index.html` em um navegador
2. Navegue pelas seções: Sobre mim, Hard Skills, Projetos

### Adicionar Novo Projeto (Admin)
1. Clique no card "Add Project" (+)
2. Faça login com as credenciais:
   - **E-mail**: `brigoni2011@gmail.com`
   - **Senha**: `henrique2803!`
3. Preencha os dados do projeto:
   - Título
   - Descrição
   - URL
   - Imagem (arquivo PNG/JPEG)
4. Clique em "Salvar"

## 🔧 Estrutura do Projeto

```
PortifolioBrunoRigoni/
├── index.html              # Página principal
├── style/
│   └── index.css          # Estilos CSS
├── scripts/
│   ├── index.js           # Lógica principal
│   └── firebase-test.js   # Script de teste
├── config/
│   ├── firebase-config.js # Configuração Firebase
│   └── admin-credentials.js # Credenciais admin
├── assets/
│   └── img/               # Imagens dos projetos
└── README.md              # Este arquivo
```

## 📊 Banco de Dados

### Coleção: `projects`
Cada projeto é armazenado como um documento:
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

## 🖼️ Gerenciamento de Imagens

Como o Firebase Storage requer plano pago, as imagens são gerenciadas de forma alternativa:

### Opções Recomendadas:
1. **URLs Externas**: Hospedar em serviços gratuitos
   - Imgur
   - Cloudinary (plano gratuito)
   - GitHub (repositório separado)

2. **CDN Gratuito**: jsDelivr, unpkg

3. **Base64**: Para imagens pequenas (não recomendado para muitas)

## 🚨 Solução de Problemas

### Firebase não inicializa
- Verifique se `config/firebase-config.js` está sendo carregado
- Confirme se não há erros JavaScript no console

### Erro de permissão
- Verifique as regras do Firestore
- Confirme se o domínio está autorizado

### Login não funciona
- Verifique se o usuário foi criado no Authentication
- Confirme se Email/Password está habilitado

### Teste de Conectividade
Use o script de teste no console do navegador:
```javascript
// Cole no console
await testFirebaseConnection();
```

## 📈 Deploy

### GitHub Pages
1. Faça push para o repositório
2. Em Settings > Pages, ative GitHub Pages
3. Selecione a branch `main`
4. Acesse: `https://seu-usuario.github.io/PortifolioBrunoRigoni`

## 💰 Custos

- **Firestore**: ✅ Gratuito (até 1GB)
- **Authentication**: ✅ Gratuito (até 10.000 usuários)
- **Storage**: ❌ Requer plano Blaze (pago)
- **Hosting**: ✅ Gratuito (até 10GB)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Consulte a documentação do Firebase
3. Abra uma issue no repositório

---

**Desenvolvido por Bruno Henrique Rigoni** 🚀
