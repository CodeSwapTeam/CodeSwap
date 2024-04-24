

//Função para salvar o cache do usuário no sessionStorage

export const saveUserCache = (user) => {
    sessionStorage.setItem('currentUserData', JSON.stringify(user));
}
//Função para buscar o cache do usuário no sessionStorage
export const getUserCache = () => {
    return JSON.parse(sessionStorage.getItem('currentUserData'));
}

//Função para remover o cache do usuário no sessionStorage
export const removeUserCache = () => {
    sessionStorage.removeItem('currentUserData');
}


////////FUNÇÕES PARA O TOKEN DE ACESSO/////////////////////////////

//Função para salvar o cache do token no sessionStorage
export const saveTokenCache = (token) => {
    sessionStorage.setItem('token', token);
}

//Função para buscar o cache do token no sessionStorage
export const getTokenCache = () => {
    return sessionStorage.getItem('token');
}

//Função para remover o cache do token no sessionStorage
export const removeTokenCache = () => {
    sessionStorage.removeItem('token');
}

