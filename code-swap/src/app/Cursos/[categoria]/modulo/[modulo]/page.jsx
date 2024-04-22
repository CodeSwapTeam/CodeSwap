"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/contexts/Auth';
import Controller from '@/Controller/controller';

const Page = () => {

    const controller = Controller();

    // Obtém a função setCurrentUser do contexto de autenticação
    const { setCurrentUser } = useAuthContext();
    // Obtém o roteador para navegação
    const router = useRouter();
    // Obtém os parâmetros categoria e modulo da URL
    const { categoria, modulo } = useParams();
    // Define o estado para o módulo atual, inicialmente um array vazio
    const [module, setModule] = useState([]);
    // Define o estado para a lição selecionada, inicialmente nulo
    const [lessonSelected, setLessonSelected] = useState(null);

    const fetchModule = async () => {
        // Busca o módulo pelo id da categoria e do módulo
        const moduleData = await controller.manageModules.getModuleByCourseAndModuleId(categoria, modulo);
        // Atualiza o estado do módulo com os dados obtidos
        setModule(moduleData);
    };

    useEffect(() => {
        fetchModule();
    }, [categoria, modulo]);



    function handleLessonClick(index) {
        //pegar  a lesson selecionada dentro do modulo pelo index
        const lesson = module[0].lessons[index];
        //atualizar o estado da lesson selecionada
        setLessonSelected(lesson);
    }

    //função para concluir o curso
    const handleFinishModule = () => {

        //chamar a função de atualizar o status do curso
        controller.manageModules.finishUserModule(categoria, modulo, setCurrentUser);

        //redirecionar para a página de cursos
        router.push(`/Cursos/${categoria}`);

    }



    return (
        <div>

            <p></p>

            {module.map((module, index) => (
                <div key={index} style={{ backgroundColor: '#f0f0f0', margin: '20px', padding: '10px', flexDirection: 'column', border: '1px solid black' }}>
                    <h2 style={{ color: 'blue' }}>{module.nameModule}</h2>

                    <div style={{ border: '1px solid black', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                        <div style={{ border: '1px solid black', height: '40vw', width: '70vw' }}>

                        </div>

                        <div style={{ border: '1px solid black', height: '40vw', width: '30vw', flexDirection: 'column' }}>
                            <div style={{ border: '1px solid black' }} >
                                {module.lessons.map((lesson, index) => (
                                    <div key={index} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                                        <h3 onClick={() => handleLessonClick(index)} style={{ color: 'green' }}>{lesson.nameLesson}</h3>

                                    </div>
                                ))}
                            </div>
                            <button onClick={handleFinishModule} style={{ backgroundColor: '#d0d0d0' }}>Teste Final</button>
                        </div>

                    </div>
                    <p>{lessonSelected ? lessonSelected.description : module.description}</p>
                </div>
            ))}

        </div>
    );
};

export default Page;