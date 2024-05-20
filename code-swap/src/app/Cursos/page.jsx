
import React from 'react';
import Carousel from '../MyCourses/UI/Caroucel';
import useStateManagement from '../MyCourses/StoreData/StateManagement';
import InitializerData from '../MyCourses/StoreData/InitializerData';
import Loading from '../Components/Loading/loading';

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

            <div style={{ marginTop: '60px' }}>
                 {categoriesData && <InitializerData categories={categoriesData} />} 
                

                <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
                    {categoriesData && categoriesData.map((category, index) => (
                        <div key={index} style={{}}>
                            <h2 style={{ color: '#45ff45', fontSize: '2rem', marginLeft: '40px'  }}>{category.name}</h2>

                            {category.courses && <Carousel courses={category.courses}  />}

                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Page;