'use client';

//Página de pagamento do plano swap pro

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCookies } from '@/app/services/cookies';
import { decryptObjectData } from '@/app/services/encryptedAlgorithm';
//import { getPlanById } from '../../../database/functions/getPlanById';

const PageSwapPro = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    //função que checa se o usuario está logado
    const checkUser = async () => {
        //verificar se o usuario esta logado checando se o token de acesso esta nos cookies
        const cookies = await getCookies();

        let userDecrypted = null;
        try {
            //descriptografar o token de acesso se cookies não for undefined
            if (cookies) {
                userDecrypted = decryptObjectData(cookies.value);
                setUser(userDecrypted);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        checkUser();
    }, []);

    return (
        <div>
            <h1>Swap Pro</h1>
            <h2>Plano de assinatura</h2>
            <p>Assine o Swap Pro para ter acesso a todos os cursos e módulos disponíveis na plataforma.</p>
            <p>Valor: R$ 19,90/mês</p>
            <button onClick={() => router.push('/pagamento')}>Assinar</button>
        </div>
    );
}

export default PageSwapPro;