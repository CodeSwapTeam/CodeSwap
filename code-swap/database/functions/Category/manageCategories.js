import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

//>>>>FUNÇÃO ALTERNADA PARA API<<<< Funcão para criar uma categoria
export const CreateCategory = async (data) => {

    const categoryData = {
        name: data.name,
        description: data.description,
        Badge: data.Badge,
        courses: [],
        PositionBadgeMap: data.PositionBadgeMap
    }

    try {
        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para criar uma categoria no banco de dados
        const response = await fetch('/api/posts?type=CreateCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar a categoria');
        }

        const data = await response.json();
        alert(data.message);

    } catch (error) {
        console.error('Erro ao Criar categoria:', error);
        throw error;
    }
};

// >>>>FUNÇÃO ALTERNADA PARA API<<<< Função para retornar todas as categorias do banco de dados
export const GetAllCategories = async () => {


    try {
        const response = await fetch('/api/gets?type=categories');
        const data = await response.json();//retorna um array de objetos com as categorias
        console.log('data', data);
        return data;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error;
    }
};


// Função para deletar uma categoria no banco de dados
export const DeleteCategory = async (categoryId) => {
    try {
        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router DELETE para deletar uma categoria no banco de dados
        const response = await fetch(`/api/delete?type=category&id=${categoryId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar a categoria');
        }

        alert('Categoria deletada com sucesso!');

    } catch (error) {
        console.error('Erro ao deletar a categoria:', error);
        throw error;
    }
};





//fução para salvar a imgUrlThumbnail no banco de dados e no cache local
export const SaveImgUrlThumbnail = async (categoryId, courseId, imgUrlThumbnail) => {
    try {
        const categoryRef = doc(db, 'Categories', categoryId);

        //pegar a categoria
        const categorySnap = await getDoc(categoryRef);
        if (!categorySnap.exists()) {
            // O documento não existe.
            console.log('No such document!');
        } else {
            // O documento existe, você pode chamar o método data().
            const category = categorySnap.data();
            //verificar se o curso existe
            const course = category.courses.find(course => course.id === courseId);

            if (course) {
                course.imgUrlThumbnail = imgUrlThumbnail;
                await updateDoc(categoryRef, { courses: category.courses });
            }
        }

    } catch (error) {
        console.error('Erro ao salvar a imagem da categoria:', error);
        throw error;
    }
};



//Função para atualizar uma categoria no banco de dados 
export const UpdateCategoryData = async (data) => {
    //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
    try {
        //api router PUT para atualizar uma categoria no banco de dados
        const response = await fetch(`/api/posts?type=UpdateCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a categoria');
        }

        alert('Categoria atualizada com sucesso!');

        
    } catch (error) {
        
    }
};

//função para pegar os objetos de todas as posições do grid do mapa da categoria dentro de Categories/ PositionsMap tem um atributo position que recebe um objeto info, e positionX e positionY
export const GetCategoryPositionsMap = async (categoryId) => {
    try {
        //pegar o atributo positionsMap da categoria
        const categoryRef = doc(db, 'Categories', categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
            // O documento não existe.
            console.log('No such document!');
        } else {
            // O documento existe, você pode chamar o método data().
            const category = categorySnap.data();
            return category.positionsMap;
        }
    }
    catch (error) {
        console.error('Erro ao buscar as posições do mapa:', error);
        throw error;
    }
};

//função para pegar um objeto especifico atraves do x e y do grid do mapa da categoria dentro de Categories/ PositionsMap tem um atributo position que recebe um objeto info, e positionX e positionY
export const GetCategoryPositionMap = async (categoryId, positionX, positionY) => {
    try {
        //pegar o atributo positionsMap da categoria
        const categoryRef = doc(db, 'Categories', categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
            // O documento não existe.
            console.log('No such document!');
        } else {
            // O documento existe, você pode chamar o método data().
            const category = categorySnap.data();
            //retornar o objeto que tem a posição x e y
            return category.positionsMap.find(position => position.coordinates.positionX === positionX && position.coordinates.positionY === positionY);
        }
    }
    catch (error) {
        console.error('Erro ao buscar a posição no mapa:', error);
        throw error;
    }
};

// Função para criar um objeto de coordenadas
const createCoordinates = (positionX, positionY, info) => ({
    coordinates: { positionX, positionY },
    info
  });
  
  // Função para atualizar o mapa de posições de um documento
  const updatePositionsMap = async (docRef, coordinates) => {
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      console.log('No such document!');
      return;
    }
  
    await updateDoc(docRef, { positionsMap: arrayUnion(coordinates) });
  };
  
  export const CreateCategoryPositionMap = async (moduleId, categoryId, positionX, positionY, info) => {
    try {
      const coordinates = createCoordinates(positionX, positionY, info);
  
      const categoryRef = doc(db, 'Categories', categoryId);
      await updatePositionsMap(categoryRef, coordinates);
  
      const moduleRef = doc(db, 'Modules', moduleId);
      await updatePositionsMap(moduleRef, coordinates);
    } catch (error) {
      console.error('Erro ao criar a posição no mapa:', error);
      throw error;
    }
  };