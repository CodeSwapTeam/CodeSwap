'use server'; 
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = 'mysecret';

const AuthService = async () => {
    
    const cookieStore = cookies();

    const saveToken = (token) => {
        //Salvar nos cookies o token de acesso

        //criptografar o token com a chave secreta
        const tokenEncrypted = jwt.sign(token, secret);
        cookieStore.set('user', tokenEncrypted);
    };

    const getToken = () => {
        const token = cookieStore.get('user')?.value;

        if (!token) {
            return null;
        }

        return jwt.verify(token, secret);
        
    };

    const removeToken = () => {
        cookieStore.delete('user');
    };

    const login = async (email, password) => {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Erro ao efetuar login');
        }

        const { token } = await response.json();

        saveToken(token);

        return jwt.decode(token);
    };

    const logout = () => {
        removeToken();
    };

    const isAuthenticated = () => {
        return getToken() !== null;
    };

    return {
        login,
        logout,
        isAuthenticated,
    };
};

export default AuthService;