// Última atualização: 2024-12-19 17:45:00 (commit: feat: Adicionar funcionalidade de edição de projetos com ícone de lápis)
console.log('🔄 Portfólio Bruno Rigoni - Última atualização:', new Date('2024-12-19T17:45:00').toLocaleString('pt-BR'), '| Commit: feat: Adicionar funcionalidade de edição de projetos com ícone de lápis');

// Importar funções do Firebase
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Animação de entrada para elementos
document.addEventListener('DOMContentLoaded', function() {
    // Animar elementos ao carregar a página
    const animatedElements = document.querySelectorAll('.glass, header h1, header img, header p');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Efeito de hover apenas nos elementos de projetos
    const projectElements = document.querySelectorAll('.projects-grid .glass, .project-item');
    
    projectElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Carregar projetos do Firebase
    loadProjectsFromFirebase();
});

// Função para expandir/colapsar seções
function toggleSection(headerElement) {
    const section = headerElement.closest('.collapsible-section');
    const content = section.querySelector('.section-content');
    const isExpanded = headerElement.classList.contains('expanded');
    
    if (isExpanded) {
        // Colapsar
        headerElement.classList.remove('expanded');
        content.classList.remove('expanded');
    } else {
        // Expandir
        headerElement.classList.add('expanded');
        content.classList.add('expanded');
    }
}

// Efeito de digitação melhorado
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Adicionar cursor piscante no final
            element.style.borderRight = '3px solid var(--primary-color)';
        }
    }
    
    type();
}

// Inicializar efeito de digitação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const originalText = typingElement.textContent;
        typingElement.textContent = '';
        
        setTimeout(() => {
            typeWriter(typingElement, originalText, 150);
        }, 1000);
    }
});

// Funções para modais
function openAddProjectModal() {
    // Sempre solicitar login primeiro (removendo verificação do localStorage)
    openModal('loginModal');
}

function openEditProjectModal(projectId, title, description, url, imageUrl) {
    // Verificar se está logado
    if (!isLoggedIn()) {
        openModal('loginModal');
        return;
    }
    
    // Preencher o modal com os dados atuais
    document.getElementById('projectTitle').value = title;
    document.getElementById('projectDescription').value = description;
    document.getElementById('projectUrl').value = url;
    
    // Limpar arquivo de imagem (não é possível editar imagem existente por enquanto)
    document.getElementById('projectImage').value = '';
    
    // Limpar preview
    const previewContainer = document.getElementById('imagePreview');
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }
    
    // Adicionar ID do projeto ao modal para identificação
    const modal = document.getElementById('addProjectModal');
    modal.dataset.editProjectId = projectId;
    
    // Alterar título e botão do modal
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.textContent = 'Editar Projeto';
    
    const submitButton = modal.querySelector('button[type="submit"]');
    submitButton.textContent = 'Atualizar Projeto';
    
    // Abrir modal
    openModal('addProjectModal');
}

function resetModalToCreateMode() {
    // Resetar formulário
    document.getElementById('addProjectForm').reset();
    
    // Remover ID de edição
    const modal = document.getElementById('addProjectModal');
    delete modal.dataset.editProjectId;
    
    // Restaurar título e botão originais
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.textContent = 'Adicionar Novo Projeto';
    
    const submitButton = modal.querySelector('button[type="submit"]');
    submitButton.textContent = 'Adicionar Projeto';
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Verificar se está logado
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Função para limpar login (útil para testes)
function clearLogin() {
    localStorage.removeItem('adminLoggedIn');
}

// Função para fazer login com Firebase
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        // Tentar login com Firebase primeiro
        if (window.firebaseAuth) {
            const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
            if (userCredential.user) {
                // Login bem-sucedido
                localStorage.setItem('adminLoggedIn', 'true');
                closeModal('loginModal');
                openModal('addProjectModal');
                
                // Limpar formulário
                document.getElementById('loginForm').reset();
                return;
            }
        }
    } catch (error) {
        console.log('Firebase login failed, trying fallback:', error);
    }
    
    // Fallback para credenciais hardcoded
    const adminEmail = 'brigoni2011@gmail.com';
    const adminPassword = 'henrique2803!';
    
    if (email === adminEmail && password === adminPassword) {
        // Login bem-sucedido
        localStorage.setItem('adminLoggedIn', 'true');
        closeModal('loginModal');
        openModal('addProjectModal');
        
        // Limpar formulário
        document.getElementById('loginForm').reset();
    } else {
        alert('Credenciais inválidas!');
    }
}

// Função para carregar projetos do Firebase
async function loadProjectsFromFirebase() {
    try {
        console.log('Tentando carregar projetos do Firebase...');
        
        if (!window.firebaseDb) {
            console.error('Firebase não inicializado - window.firebaseDb não encontrado');
            return;
        }

        console.log('Firebase DB encontrado, buscando projetos...');
        const projectsCollection = collection(window.firebaseDb, 'projects');
        const querySnapshot = await getDocs(projectsCollection);
        
        console.log(`Encontrados ${querySnapshot.size} projetos no Firebase`);
        
        const projectsGrid = document.querySelector('.projects-grid');
        const addProjectCard = document.querySelector('.add-project-card');
        
        if (!projectsGrid || !addProjectCard) {
            console.error('Elementos do DOM não encontrados');
            return;
        }
        
        // Limpar projetos existentes (exceto o card de adicionar)
        const existingProjects = projectsGrid.querySelectorAll('.card:not(.add-project-card)');
        existingProjects.forEach(project => project.remove());
        
        // Adicionar projetos do Firebase
        querySnapshot.forEach((doc) => {
            const projectData = doc.data();
            console.log('Projeto carregado:', projectData);
            const projectCard = createProjectCard(
                projectData.title,
                projectData.description,
                projectData.url,
                projectData.imageUrl,
                doc.id
            );
            projectsGrid.insertBefore(projectCard, addProjectCard);
        });
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        console.error('Detalhes do erro:', error.message);
    }
}

// Função para adicionar novo projeto
async function handleAddProject(event) {
    event.preventDefault();
    
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const url = document.getElementById('projectUrl').value.trim();
    const imageFile = document.getElementById('projectImage').files[0];
    
    // Verificar se é edição ou criação
    const modal = document.getElementById('addProjectModal');
    const isEditing = modal.dataset.editProjectId;
    
    if (isEditing) {
        // Modo edição - não requer imagem
        if (!title || !description || !url) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    } else {
        // Modo criação - requer imagem
        if (!title || !description || !url || !imageFile) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    }
    
    // Validar arquivo de imagem
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(imageFile.type)) {
        alert('Por favor, selecione apenas arquivos PNG, JPEG ou JPG.');
        return;
    }
    
    if (imageFile.size > maxSize) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }
    
    try {
        let imageUrl = '';
        let imageFileName = '';
        
        // Como o Firebase Storage requer plano pago, vamos usar uma solução alternativa
        // Por enquanto, criamos uma URL local para preview e salvamos o nome do arquivo
        imageUrl = URL.createObjectURL(imageFile);
        imageFileName = imageFile.name;
        
        if (window.firebaseDb) {
            if (isEditing) {
                // Modo edição - atualizar projeto existente
                console.log('Atualizando projeto no Firestore...');
                const projectRef = doc(window.firebaseDb, 'projects', isEditing);
                const updateData = {
                    title: title,
                    description: description,
                    url: url,
                    updatedAt: new Date()
                };
                
                console.log('Dados do projeto a serem atualizados:', updateData);
                await updateDoc(projectRef, updateData);
                console.log('Projeto atualizado com sucesso! ID:', isEditing);
            } else {
                // Modo criação - adicionar novo projeto
                console.log('Salvando projeto no Firestore...');
                const projectsCollection = collection(window.firebaseDb, 'projects');
                const projectData = {
                    title: title,
                    description: description,
                    url: url,
                    imageUrl: `placeholder_${imageFileName}`, // Placeholder para o banco de dados
                    imageFileName: imageFileName, // Nome do arquivo para referência
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                console.log('Dados do projeto a serem salvos:', projectData);
                const docRef = await addDoc(projectsCollection, projectData);
                console.log('Projeto salvo com sucesso! ID:', docRef.id);
            }
            
            // Recarregar projetos do Firebase
            await loadProjectsFromFirebase();
        } else {
            console.log('Firebase não disponível, salvando localmente...');
            // Fallback para armazenamento local
            const project = {
                id: Date.now(),
                title: title,
                description: description,
                url: url,
                imageUrl: imageUrl
            };
            
            // Adicionar ao array local
            if (!window.localProjects) {
                window.localProjects = [];
            }
            window.localProjects.push(project);
            
            // Adicionar card do projeto
            addProjectCard(project);
        }
        
        closeModal('addProjectModal');
        
        // Resetar modal para modo de criação
        resetModalToCreateMode();
        
        // Limpar preview da imagem
        const previewContainer = document.getElementById('imagePreview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        
        const message = isEditing ? 'Projeto atualizado com sucesso!' : 'Projeto adicionado com sucesso!';
        alert(message);
        
    } catch (error) {
        console.error('Erro ao adicionar projeto:', error);
        console.error('Detalhes do erro:', error.message);
        console.error('Stack trace:', error.stack);
        alert('Erro ao adicionar projeto. Tente novamente. Verifique o console para mais detalhes.');
    }
}

// Função para criar card de projeto
function createProjectCard(title, description, url, imageUrl, projectId = null) {
    const card = document.createElement('div');
    card.className = 'card';
    
    if (projectId) {
        card.dataset.projectId = projectId;
    }
    
    // Determinar a URL da imagem a ser exibida
    let displayImageUrl = imageUrl;
    if (imageUrl && imageUrl.startsWith('placeholder_')) {
        // Se for um placeholder, usar uma imagem padrão
        displayImageUrl = './assets/img/profile-user.png';
    }
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${displayImageUrl}" alt="${title}" onerror="this.src='./assets/img/profile-user.png'">
            <div class="edit-icon" title="Editar projeto">
                ✏️
            </div>
        </div>
        <div class="card-content">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
        <a href="${url}" target="_blank" class="project-link-overlay"></a>
    `;
    
    // Armazenar a URL da imagem para limpeza posterior se necessário
    if (imageUrl && imageUrl.startsWith('blob:')) {
        card.dataset.imageUrl = imageUrl;
    }
    
    // Adicionar event listener para edição
    const editIcon = card.querySelector('.edit-icon');
    if (editIcon) {
        editIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditProjectModal(projectId, title, description, url, imageUrl);
        });
    }
    
    return card;
}

// Função para limpar URLs de objetos criados
function cleanupObjectURLs() {
    const cards = document.querySelectorAll('.card[data-image-url]');
    cards.forEach(card => {
        const imageUrl = card.dataset.imageUrl;
        if (imageUrl && imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
        }
    });
}

// Logout (opcional - pode ser adicionado em um menu)
function logout() {
    localStorage.removeItem('adminLoggedIn');
    alert('Logout realizado com sucesso!');
}

// Função para preview da imagem selecionada
function handleImagePreview(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('imagePreview');
    
    if (!previewContainer) {
        // Criar container de preview se não existir
        const container = document.createElement('div');
        container.id = 'imagePreview';
        container.className = 'image-preview';
        container.style.cssText = `
            margin-top: 1rem;
            text-align: center;
            padding: 1rem;
            border: 1px solid rgba(97, 218, 251, 0.3);
            border-radius: 8px;
            background: rgba(68, 71, 90, 0.2);
        `;
        
        const imageInput = document.getElementById('projectImage');
        imageInput.parentNode.insertBefore(container, imageInput.nextSibling);
    }
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewContainer = document.getElementById('imagePreview');
            previewContainer.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                    ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        const previewContainer = document.getElementById('imagePreview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    }
}

// Adicionar listener para preview da imagem
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('projectImage');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
});

// Exportar funções para uso global
window.handleLogin = handleLogin;
window.handleAddProject = handleAddProject;
window.openAddProjectModal = openAddProjectModal;
window.openEditProjectModal = openEditProjectModal;
window.closeModal = closeModal;
window.toggleSection = toggleSection;
window.logout = logout;
window.clearLogin = clearLogin;
