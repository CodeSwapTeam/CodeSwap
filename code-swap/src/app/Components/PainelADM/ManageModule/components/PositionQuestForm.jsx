'use client';
import Controller from '@/Controller/controller';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const Input = styled.input`
  margin-bottom: 10px;
  color: black;
`;

const PositionForm = (moduleSelected) => {
   const queryClient = useQueryClient();

const controller = Controller();
const moduleId = moduleSelected.moduleSelected.id;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const module = await queryClient.getQueryData(['Module-Selected']);
            if (module && module.positionsMap && module.positionsMap.length > 0) {
              const { coordinates: { positionX, positionY }, info: { title, linkQuest } } = module.positionsMap[0];
              setX(positionX);
              setY(positionY);
              setTitle(title);
              setLink(linkQuest);
            }
      
            const categories = await controller.manageCategories.GetAllCategories();
            if (categories) {
              setCategories(categories);
            }
          } catch (error) {
            console.error('Erro ao buscar dados:', error);
          }
        };
      
        fetchData();
      }, []);

  const SelectChangeCategoryId = (event) => {
    setSelectedCategoryId(event.target.value);
    console.log(selectedCategoryId);

    /* //pegar a categoria selecionada e buscar as posições do mapa
    const infoData = categories.find(category => category.id === event.target.value);
    console.log('infoData', infoData); */

  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(selectedCategoryId === undefined) return console.log('Categoria não selecionada')

    let info = {
        title: title,
        linkQuest: link,
        moduleId: moduleId
    }
    
    /* console.log(`
        X: ${x}
        Y: ${y}
        Title: ${title}
        Link: ${link}
        categoryId: ${selectedCategoryId}
        moduleSelected: ${moduleId}
        `) */
    await controller.manageCategories.CreateCategoryPositionMap(moduleId, selectedCategoryId, x, y, info);
    
  };


  return (
      <>
          {categories && (
            <div style={{display:'flex'}}>
              <Form onSubmit={handleSubmit}>
                  <Input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} placeholder="X" />
                  <Input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} placeholder="Y" />
                      <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                      <Input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" />
                      <button type="submit">Salvar</button>
                  </Form>

                  <div style={{width:'60%', color:'black'}}>
                      <h1>Posições no mapa</h1>
                      {moduleSelected.moduleSelected && moduleSelected.moduleSelected.positionsMap && (
                          <select style={{width:'90%'}}
                              onChange={(e) => {
                                  const position = moduleSelected.moduleSelected.positionsMap[e.target.value];
                                  setX(position.coordinates.positionX);
                                  setY(position.coordinates.positionY);
                                  setTitle(position.info.title);
                                  setLink(position.info.linkQuest);
                              }}
                          >
                              {moduleSelected.moduleSelected.positionsMap.map((position, index) => (
                                  <option key={index} value={index}>
                                      {position.info.title}
                                  </option>
                              ))}
                          </select>
                      )}
                  </div>

            </div>
          )}

          <select value={selectedCategoryId} onChange={SelectChangeCategoryId} style={{ color: 'black' }}>
              {categories && categories.map((category, index) => (
                  <option key={index} value={category.id}>
                      {category.name}
                  </option>
              ))}
          </select>
      </>
  );
};

export default PositionForm;