function encryptToken(tokenAcessoDescriptografado, chaveInterna) {
    
    while (chaveInterna.length < tokenAcessoDescriptografado.length) {
        chaveInterna += chaveInterna;
    }

    
    let tokenCriptografado = '';
    for (let i = 0; i < tokenAcessoDescriptografado.length; i++) {
       
        const charCodeDescriptografado = tokenAcessoDescriptografado.charCodeAt(i);
        const charCodeChave = chaveInterna.charCodeAt(i);
        const charCodeCriptografado = charCodeDescriptografado ^ charCodeChave;
        
        tokenCriptografado += String.fromCharCode(charCodeCriptografado);
    }

    return tokenCriptografado;
}

export function Algorithm(userTokenAcess) {
    //console.log(user);
    let userToken;
    if(!userTokenAcess){
        userToken = ''
    }else{
        userToken = userTokenAcess
    }
    const chaveInterna = '4d5a3w1d@5FD**1/1%7&';
    const tokenAcessoDescriptografado = userToken;

    // Chamar a função para criptografar o token de acesso
    const tokenAcessoCriptografado = encryptToken(tokenAcessoDescriptografado, chaveInterna);

    return tokenAcessoCriptografado;
}

export function decryptToken(tokenCriptografado) {
    let chaveInterna = '4d5a3w1d@5FD**1/1%7&';
    // Garantir que a chave interna tenha o mesmo comprimento que o token criptografado
    while (chaveInterna.length < tokenCriptografado.length) {
        chaveInterna += chaveInterna;
    }

    // Descriptografar os dados aplicando a operação XOR bit a bit novamente
    let tokenDescriptografado = '';
    for (let i = 0; i < tokenCriptografado.length; i++) {
        const charCodeCriptografado = tokenCriptografado.charCodeAt(i);
        const charCodeChave = chaveInterna.charCodeAt(i);
        const charCodeDescriptografado = charCodeCriptografado ^ charCodeChave;
        tokenDescriptografado += String.fromCharCode(charCodeDescriptografado);
    }

    return tokenDescriptografado;
}


function encryptData(objeto, chaveInterna) {
    // Convertendo o objeto em uma string JSON
    const jsonString = JSON.stringify(objeto);
    
    // Criptografar os dados usando a chave interna e a operação XOR
    let dadosCriptografados = '';
    for (let i = 0; i < jsonString.length; i++) {
        const charCode = jsonString.charCodeAt(i) ^ chaveInterna.charCodeAt(i % chaveInterna.length);
        dadosCriptografados += String.fromCharCode(charCode);
    }
    
    return dadosCriptografados;
}

// Função que recebe um objeto e retorna uma string criptografada
export function encryptObjectData(objeto) {
    // Chave interna para criptografia
    const chaveInterna = '4d5a3w1d@5FD**1/1%7&';
    
    // Chamar a função para criptografar os dados do objeto
    const dadosCriptografados = encryptData(objeto, chaveInterna);
    
    return dadosCriptografados;
}




function decryptData(dadosCriptografados, chaveInterna) {
    // Descriptografar os dados usando a chave interna e a operação XOR
    let dadosDescriptografados = '';
    for (let i = 0; i < dadosCriptografados.length; i++) {
        const charCode = dadosCriptografados.charCodeAt(i) ^ chaveInterna.charCodeAt(i % chaveInterna.length);
        dadosDescriptografados += String.fromCharCode(charCode);
    }

    // Converter a string JSON descriptografada de volta para um objeto
    let objetoDescriptografado;

    try {
        objetoDescriptografado = JSON.parse(dadosDescriptografados);
    } catch (error) {
        console.error('Erro ao analisar JSON:', error);
        // Você pode definir objetoDescriptografado como um objeto vazio ou qualquer outro valor padrão
        objetoDescriptografado = {};
    }

    
    
    return objetoDescriptografado;
}

// Função que recebe uma string criptografada e retorna um objeto descriptografado
export function decryptObjectData(dadosCriptografados) {
    // Chave interna para descriptografia (a mesma chave usada para criptografia)
    const chaveInterna = '4d5a3w1d@5FD**1/1%7&';
    
    // Chamar a função para descriptografar os dados
    const objetoDescriptografado = decryptData(dadosCriptografados, chaveInterna);
    
    return objetoDescriptografado;
}











