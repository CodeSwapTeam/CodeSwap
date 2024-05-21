import React from 'react';
import Carousel from '../MyCourses/UI/Caroucel';
import useStateManagement from '../MyCourses/StoreData/StateManagement';
import InitializerData from '../MyCourses/StoreData/InitializerData';
import Loading from '../Components/Loading/loading';

const styles = `
    .my-heading {
        color: #45ff45;
        font-size: 2rem;
        margin-left: 40px;
    }

    @media (max-width: 600px) {
        .my-heading {
            font-size: 1rem;
        }
    }
`;

async function GetData(){
    const response = await fetch('http://localhost:3000/api/RequestsUsers/GET/getAllCategories', {cache: 'force-cache', next: { tags: ['All-Categories']}});
    const data = await response.json();
    const categories = data;

    return categories;

}

async function Page(){

    const categoriesData = await GetData();
  
    useStateManagement.setState({states: {categories: categoriesData}});

    if(!categoriesData) return <Loading />;

    return (
        <>
            <style>{styles}</style>
            <div style={{ marginTop: '60px' }}>
                 {categoriesData && <InitializerData categories={categoriesData} />} 
                

                <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
                    {categoriesData && categoriesData.map((category, index) => (
                        <div key={index} style={{}}>
                            <h2 className="my-heading" >{category.name}</h2>

                            {category.courses && <Carousel courses={category.courses}  />}

                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Page;