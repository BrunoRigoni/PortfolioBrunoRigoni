// Última atualização: 2024-12-19 18:35:00 (commit: refactor: Alterar input de imagem para URLs ao invés de arquivos)
console.log('🔄 Portfólio Bruno Rigoni - Última atualização:', new Date('2024-12-19T18:35:00').toLocaleString('pt-BR'), '| Commit: refactor: Alterar input de imagem para URLs ao invés de arquivos');

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
    openModal('loginModal');
}

function openEditProjectModal(project) {
    const modal = document.getElementById('projectModal');
    const modalTitle = modal.querySelector('.modal-title');
    const form = modal.querySelector('form');
    const imageInput = modal.querySelector('#projectImage');
    const imagePreview = modal.querySelector('.image-preview');
    const currentImagePreview = modal.querySelector('.current-image-preview');
    
    // Configurar modal para edição
    modalTitle.textContent = 'Editar Projeto';
    form.dataset.editMode = 'true';
    form.dataset.projectId = project.id;
    form.dataset.currentImageUrl = project.imageUrl;
    
    // Preencher campos com dados existentes
    form.querySelector('#projectTitle').value = project.title;
    form.querySelector('#projectDescription').value = project.description;
    form.querySelector('#projectUrl').value = project.url;
    imageInput.value = project.imageUrl;
    
    // Mostrar preview da imagem atual
    if (currentImagePreview) {
        currentImagePreview.style.display = 'block';
        currentImagePreview.querySelector('img').src = project.imageUrl;
        currentImagePreview.querySelector('p').textContent = 'Imagem atual:';
    }
    
    // Mostrar preview da nova imagem se houver
    if (imageInput.value) {
        imagePreview.style.display = 'block';
        imagePreview.querySelector('img').src = imageInput.value;
    } else {
        imagePreview.style.display = 'none';
    }
    
    // Adicionar botão de excluir
    const formActions = form.querySelector('.form-actions');
    if (!formActions.querySelector('.btn-delete')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = 'Excluir Projeto';
        deleteBtn.onclick = () => deleteProject(project.id);
        formActions.appendChild(deleteBtn);
    }
    
    openModal('projectModal');
}

function resetModalToCreateMode() {
    // Resetar formulário
    document.getElementById('addProjectForm').reset();
    
    // Remover ID de edição
    const modal = document.getElementById('addProjectModal');
    delete modal.dataset.editProjectId;
    delete modal.dataset.currentImageUrl; // Remover URL da imagem atual
    
    // Restaurar título e botão originais
    const modalTitle = modal.querySelector('.modal-header h3');
    modalTitle.textContent = 'Adicionar Novo Projeto';
    
    const submitButton = modal.querySelector('button[type="submit"]');
    submitButton.textContent = 'Adicionar Projeto';

    // Remover botão de exclusão
    const formActions = modal.querySelector('.form-actions');
    const deleteButton = formActions.querySelector('.btn-delete');
    if (deleteButton) {
        deleteButton.remove();
    }
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
            const projectCard = createProjectCard(projectData);
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
    
    const form = event.target;
    const title = form.querySelector('#projectTitle').value.trim();
    const description = form.querySelector('#projectDescription').value.trim();
    const url = form.querySelector('#projectUrl').value.trim();
    const imageUrl = form.querySelector('#projectImage').value.trim();
    
    if (!title || !description || !url) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar URL da imagem se fornecida
    if (imageUrl && !isValidImageUrl(imageUrl)) {
        alert('Por favor, forneça uma URL válida de imagem (deve terminar com extensão de imagem válida).');
        return;
    }
    
    const isEditing = form.dataset.editMode === 'true';
    const projectId = form.dataset.editMode === 'true' ? form.dataset.projectId : null;
    
    console.log('Salvando projeto no Firestore...');
    
    if (isEditing) {
        // Modo edição - atualizar projeto existente
        const updateData = {
            title: title,
            description: description,
            url: url,
            updatedAt: new Date()
        };
        
        // Adicionar imagem se fornecida
        if (imageUrl) {
            updateData.imageUrl = imageUrl;
        } else {
            // Se não foi alterada, manter a imagem atual
            const currentImageUrl = form.dataset.currentImageUrl;
            if (currentImageUrl) {
                updateData.imageUrl = currentImageUrl;
            }
        }
        
        console.log('Dados para atualização:', updateData);
        
        updateDoc(doc(window.firebaseDb, 'projects', projectId), updateData)
            .then(() => {
                console.log('Projeto atualizado com sucesso!');
                loadProjectsFromFirebase();
                closeModal('projectModal');
                resetModalToCreateMode();
            })
            .catch((error) => {
                console.error('Erro ao atualizar projeto:', error);
                alert('Erro ao atualizar projeto. Tente novamente.');
            });
    } else {
        // Modo criação - criar novo projeto
        const projectData = {
            title: title,
            description: description,
            url: url,
            imageUrl: imageUrl || 'assets/img/profile-user.png', // Usar imagem padrão se não fornecida
            createdAt: new Date(),
        };
        
        console.log('Dados do projeto a serem salvos:', projectData);
        
        addDoc(collection(window.firebaseDb, 'projects'), projectData)
            .then(() => {
                console.log('Projeto criado com sucesso!');
                loadProjectsFromFirebase();
                closeModal('projectModal');
                resetModalToCreateMode();
            })
            .catch((error) => {
                console.error('Erro ao criar projeto:', error);
                alert('Erro ao criar projeto. Tente novamente.');
            });
    }
}

// Função para criar card de projeto
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Usar a URL da imagem do projeto ou imagem padrão
    const displayImageUrl = project.imageUrl || 'assets/img/profile-user.png';
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${displayImageUrl}" alt="${project.title}" onerror="this.src='assets/img/profile-user.png'">
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.url}" target="_blank" class="btn btn-primary">Ver Projeto</a>
        </div>
        <div class="edit-icon" onclick="openEditProjectModal(${JSON.stringify(project).replace(/"/g, '&quot;')})">
            ✏️
        </div>
    `;
    
    return card;
}

// Função para limpar URLs de objetos criados
function cleanupObjectURLs() {
    // Não há mais objetos URL.createObjectURL para limpar
}

// Função para excluir projeto
async function deleteProject(projectId) {
    if (!confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        if (window.firebaseDb) {
            console.log('Excluindo projeto do Firestore...');
            const projectRef = doc(window.firebaseDb, 'projects', projectId);
            await deleteDoc(projectRef);
            console.log('Projeto excluído com sucesso! ID:', projectId);
            
            // Recarregar projetos do Firebase
            await loadProjectsFromFirebase();
            
            // Fechar modal
            closeModal('projectModal');
            resetModalToCreateMode();
            
            alert('Projeto excluído com sucesso!');
        } else {
            console.error('Firebase não disponível');
            alert('Erro: Firebase não disponível');
        }
    } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        alert('Erro ao excluir projeto. Verifique o console para mais detalhes.');
    }
}

// Logout (opcional - pode ser adicionado em um menu)
function logout() {
    localStorage.removeItem('adminLoggedIn');
    alert('Logout realizado com sucesso!');
}

// Função para preview de imagem
function previewImage(imageUrl) {
    const previewContainer = document.querySelector('.image-preview');
    
    if (!imageUrl) {
        previewContainer.style.display = 'none';
        return;
    }
    
    // Validar se é uma URL válida de imagem
    if (!isValidImageUrl(imageUrl)) {
        alert('Por favor, forneça uma URL válida de imagem.');
        return;
    }
    
    previewContainer.style.display = 'block';
    previewContainer.innerHTML = `
        <img src="${imageUrl}" alt="Preview da imagem" onerror="this.parentElement.style.display='none'; alert('Erro ao carregar imagem. Verifique se a URL está correta.');">
        <p><small>Preview da imagem</small></p>
    `;
}

// Adicionar listener para preview da imagem
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('projectImage');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
});

// Função para validar URLs de imagem
function isValidImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

// Exportar funções para uso global
window.handleLogin = handleLogin;
window.handleAddProject = handleAddProject;
window.openAddProjectModal = openAddProjectModal;
window.openEditProjectModal = openEditProjectModal;
window.closeModal = closeModal;
window.toggleSection = toggleSection;
window.logout = logout;
window.clearLogin = clearLogin;
window.deleteProject = deleteProject;
