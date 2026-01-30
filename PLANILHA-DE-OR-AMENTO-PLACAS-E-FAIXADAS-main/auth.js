// ======= SISTEMA DE AUTENTICAÇÃO =======
const USUARIOS_DB = 'usuariosDB';
const SESSION_KEY = 'sessionASInfo';

// Estrutura inicial de usuários
const usuariosIniciais = {
    'ADMnaka': {
        id: 'ADMnaka',
        senha: 'jumamjee25A@',
        tipo: 'ADM',
        nome: 'Administrador',
        ativo: true,
        dataCriacao: new Date().toISOString()
    },
    'maicon': {
        id: 'maicon',
        senha: 'jumamjee',
        tipo: 'FUNCIONARIO',
        nome: 'Maicon',
        ativo: true,
        dataCriacao: new Date().toISOString()
    }
};

// Inicializa o banco de usuários
function inicializarUsuarios() {
    if (!localStorage.getItem(USUARIOS_DB)) {
        localStorage.setItem(USUARIOS_DB, JSON.stringify(usuariosIniciais));
    }
}

// Login do usuário
function fazerLogin(id, senha) {
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_DB) || '{}');
    const usuario = usuarios[id];
    
    if (!usuario) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    if (!usuario.ativo) {
        return { sucesso: false, mensagem: 'Usuário desativado' };
    }
    
    if (usuario.senha !== senha) {
        return { sucesso: false, mensagem: 'Senha incorreta' };
    }
    
    // Cria sessão
    const session = {
        id: usuario.id,
        nome: usuario.nome,
        tipo: usuario.tipo,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    return { 
        sucesso: true, 
        usuario: session,
        mensagem: 'Login realizado com sucesso!'
    };
}

// Logout
function fazerLogout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Verifica se está logado
function verificarLogin() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(session);
}

// Verifica se é ADM
function verificarADM() {
    const session = verificarLogin();
    if (!session || session.tipo !== 'ADM') {
        alert('Acesso negado! Apenas ADMs podem acessar esta área.');
        return false;
    }
    return true;
}

// Adicionar novo usuário (apenas ADM)
function adicionarUsuario(id, senha, nome, tipo = 'FUNCIONARIO') {
    if (!verificarADM()) return false;
    
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_DB) || '{}');
    
    if (usuarios[id]) {
        return { sucesso: false, mensagem: 'ID já existe' };
    }
    
    usuarios[id] = {
        id: id,
        senha: senha,
        tipo: tipo,
        nome: nome,
        ativo: true,
        dataCriacao: new Date().toISOString()
    };
    
    localStorage.setItem(USUARIOS_DB, JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Usuário criado com sucesso!' };
}

// Remover usuário (apenas ADM)
function removerUsuario(id) {
    if (!verificarADM()) return false;
    
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_DB) || '{}');
    
    if (!usuarios[id]) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    if (id === 'ADMnaka') {
        return { sucesso: false, mensagem: 'Não é possível remover o ADM principal' };
    }
    
    delete usuarios[id];
    localStorage.setItem(USUARIOS_DB, JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Usuário removido com sucesso!' };
}

// Listar todos os usuários
function listarUsuarios() {
    if (!verificarADM()) return [];
    
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_DB) || '{}');
    return Object.values(usuarios);
}

// Atualizar usuário
function atualizarUsuario(id, dados) {
    if (!verificarADM()) return false;
    
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_DB) || '{}');
    
    if (!usuarios[id]) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    usuarios[id] = { ...usuarios[id], ...dados };
    localStorage.setItem(USUARIOS_DB, JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Usuário atualizado com sucesso!' };
}

// Inicializa o sistema
inicializarUsuarios();