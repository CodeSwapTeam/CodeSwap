


const PageSwapPro = async ({ searchParams }) => {
    const params = searchParams['course'];

    let course = await fetch(`http://localhost:3000/api/gets?id=${params}&type=courseId`);

    let courseData = await course.json();

    console.log(courseData);

    return (
        <div style={{color: 'white' }}>
            <h1>Swap Pro</h1>
            <h2>Plano de assinatura</h2>
            <p>Assine o Swap Pro para ter acesso a todos os cursos e módulos disponíveis na plataforma.</p>
            <p>Valor: R$ 19,90/mês</p>

            <h2>Imagem</h2>
            <img src={courseData[0].imgUrlThumbnail} alt={courseData.title} width={300} height={200} />

            <h2>Curso</h2>
            <p>{courseData[0].title}</p>
            <p>{courseData[0].description}</p>
        </div>
    );
}

export default PageSwapPro;