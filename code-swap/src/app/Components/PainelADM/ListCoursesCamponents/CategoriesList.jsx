import styled from 'styled-components';

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

    background-color: #0034f35c;
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

export const CategoriesList = ({ categories, handleCategory, setSelectedPainel }) => (
    <Container>
        <h3>CATEGORIAS</h3>
        <div >
            {categories && categories.map(category => (
                <CategoryContainer key={category.id} onClick={() => { handleCategory(category), setSelectedPainel('courses') }}>
                    <h4>{category.name}</h4>
                </CategoryContainer>
            ))}
        </div>
    </Container>
);