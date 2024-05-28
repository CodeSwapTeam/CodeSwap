import React, {useEffect, useState} from "react";
import Controller from "@/Controller/controller";
import { getDatabase, ref, set, update } from "firebase/database";
import { ContextDataCache } from "@/app/Providers/ContextDataCache";
import { arrayUnion } from "firebase/firestore";
import { useParams, useRouter } from 'next/navigation';



export default function ProfileConfig() {
    const { currentUser } = ContextDataCache();
    const router = useRouter();
    //Perfil
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [github, setGithub] = useState('');
    const [whatsapp, setWhatsapp] = useState(false);
    const [linkedin, setLinkedin] = useState('');
    const [education, setEducation] = useState('');
    const [educationSituation, setEducationSituation] = useState('');

    //Projetos
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectLink, setProjectLink] = useState('');

    //Controller e Banco de dados
    const controller = Controller();
    const db = getDatabase();


/*const handleNameSubmit = async (event) => {
    event.preventDefault();
    const updatedUserData = {
        userName: name,
        phone: phone,
        Github: github,
        whatsapp: whatsapp,
        linkedin: linkedin,
        education: education,
        educationSituation: educationSituation

    };
    try {
        await controller.manageUsers.UpdateUserData(currentUser.id,  updatedUserData );
        console.log(`Informações atualizadas com sucesso! Recarregue a página para ver as alterações!`);
        router.refresh();
    } catch (error) {
        console.error('Failed to update name', error);
    }
};*/

////////////////////////////////////////////////////////////////////////

const handleNameSubmit = async (event) => {
    event.preventDefault();
    let updatedUserData = {};
        if(name) updatedUserData.userName = name;
        if(phone) updatedUserData.phone = phone;
        if(github) updatedUserData.Github = github;
        if(whatsapp) updatedUserData.whatsapp = whatsapp;
        if(linkedin) updatedUserData.linkedin = linkedin;
        if(education) updatedUserData.education = education;
        if(educationSituation) updatedUserData.educationSituation = educationSituation;

    try {
        await controller.manageUsers.UpdateUserData(currentUser.id,  updatedUserData );
        alert(`Informações atualizadas com sucesso! Recarregue a página para ver as alterações!`);
        router.refresh();
    } catch (error) {
        console.error('Failed to update name', error);
    }
};


////////////////////////////////////////////////////////////////////////

const handleProjectsSubmit = async (event) => {
    event.preventDefault();
    const updatedProjectsData = {
        projectTitle: projectTitle,
        projectDescription: projectDescription,
        projectLink: projectLink


    };
    try {
        await controller.manageUsers.UpdateUserData(currentUser.id,  {Projects: arrayUnion(updatedProjectsData )});
        console.log(`Projetos atualizados: ${projectTitle}`);
        alert('Projetos atualizados com sucesso! Você pode verificar seus projetos na aba de Projetos do seu perfil!');
        router.refresh();
    } catch (error) {
        console.error('Failed to update name', error);
    }
    setProjectTitle('');
    setProjectDescription('');
    setProjectLink('');
};



    return (
        <div>
            <h1>Profile Config</h1>
            <form onSubmit={handleNameSubmit}>
                <label>
                    Nome de Usuário:
                    <input
                    style={{color:'black'}}
                    type="text"
                    value={name}
                    placeholder={currentUser.userName}
                    onChange={e => setName(e.target.value)} />
                </label>
                <br></br>
                <label>
                    Telefone:
                    <input
                    style={{color:'black'}}
                    type="number"
                    maxLength={11}
                    minLength={11}
                    placeholder={currentUser.phone === '' ? 'Digite seu telefone' : currentUser.phone}
                    value={phone}
                    onChange={e => setPhone(e.target.value)} />
                    <br />
                    <p>Gostaria de receber informações sobre cursos, promoções e bootcamps por whatsapp?</p>
                    <input
                    type="checkbox"
                    checked={whatsapp}
                    onChange={e => setWhatsapp(e.target.checked)} />
                </label>
                <br></br>
                <label>
                    Github:
                    <input
                    style={{color:'black'}}
                    type="text"
                    value={github}
                    placeholder={currentUser.Github === '' ? 'Digite seu Github' : currentUser.Github}
                    onChange={e => setGithub(e.target.value)} />
                </label>
                <br></br>
                <label>
                    Linkedin:
                    <input
                    style={{color:'black'}}
                    type="text"
                    value={linkedin}
                    placeholder={currentUser.linkedin === '' ? 'Digite seu Linkedin' : currentUser.linkedin}
                    onChange={e => setLinkedin(e.target.value)} />
                </label>
                <br></br>
                <label>
                    Educação:
                    <p>Está estudando ou já concluiu a faculdade? Registre aqui!</p><br/>
                    <p>Instituição</p> <br/>
                    <input
                    style={{color:'black'}}
                    type="text"
                    value={education}
                    onChange={e => setEducation(e.target.value)} />
                    <br/>
                    <input
                        type="radio"
                        id="interrompido"
                        name="education_situation"
                        value="interrompido"
                        checked={educationSituation === 'interrompido'}
                        onChange={e => setEducationSituation(e.target.value)}
                    />
                    <label htmlFor="interrompido">Não iniciado/Interrompido</label><br />
                    <input
                        type="radio"
                        id="cursando"
                        name="education_situation"
                        value="cursando"
                        checked={educationSituation === 'cursando'}
                        onChange={e => setEducationSituation(e.target.value)}
                    />
                    <label htmlFor="cursando">Cursando</label><br />
                    <input
                        type="radio"
                        id="concluido"
                        name="education_situation"
                        value="concluido"
                        checked={educationSituation === 'concluido'}
                        onChange={e => setEducationSituation(e.target.value)}
                    />
                    <label htmlFor="concluido">Concluido</label>
                </label>
                <br></br>
                <input style={{color:'yellow'}} type="submit" value="Salvar Informações" />
            </form>
            <br/>

            <h1>Projects Config</h1>
            <h2>Coloque aqui seus projetos que você considera importantes para mostrar para recrutadores!</h2>
            <br/>

            <form onSubmit={handleProjectsSubmit}>
                <label>
                    Título:
                    <br/>
                    <input
                    style={{color:'black'}}
                    type="text" value={projectTitle}
                    placeholder="Título do projeto"
                    onChange={e => setProjectTitle(e.target.value)} />
                    <br/>
                    <p>Descrição:</p>
                    <br/>
                    <input
                    style={{color:'black'}}
                    type="text" value={projectDescription}
                    placeholder="Uma breve descrição do projeto"
                    onChange={e => setProjectDescription(e.target.value)} />
                    <br/>
                    <p>Link:</p>
                    <br/>
                    <input
                    style={{color:'black'}}
                    type="text" value={projectLink}
                    placeholder="Link do projeto"
                    onChange={e => setProjectLink(e.target.value)} />
                </label><br/>
                <input style={{color:'pink'}} type="submit" value="Salvar Projetos" />
            </form>
        </div>
    );
    }