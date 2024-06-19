import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";

const Container = styled.div`
    flex: 20%;
    border: 2px solid white;
    padding: 10px;
    color: white;
    text-align: center;

    h3 {
        margin: 0;
    }

    div {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    background-color: #0f1425d6;
`;

const CategoryContainer = styled.div`
    border: 1px solid white;
    padding: 5px;
    margin: 5px;
    cursor: pointer;

    &:hover {
        background-color: #00ff375c;
    }
`;

export const CategoriesList = ({ setSelectedPainel, categories, handleCategory }) => {

    return (
        <Container>
            <h3>CATEGORIAS</h3>
            <div >
                {categories?.map((category, index) => (
                    <CategoryContainer key={index} onClick={() => { handleCategory(category) ,setSelectedPainel("CategoryList") }}>
                        <h4>{category.name}</h4>
                    </CategoryContainer>
                ))}
            </div>
        </Container>
    );
};