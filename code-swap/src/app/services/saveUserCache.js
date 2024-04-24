

//Função para salvar o cache do usuário no sessionStorage

export const saveUserCache = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
}
//Função para buscar o cache do usuário no sessionStorage
export const getUserCache = () => {
    return JSON.parse(sessionStorage.getItem('user'));
}

//Função para remover o cache do usuário no sessionStorage
export const removeUserCache = () => {
    sessionStorage.removeItem('user');
}

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

