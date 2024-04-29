import styled from 'styled-components';
import AddModuleModal from '../../Modals/modalAddModule';

const ModuleContainer = styled.div`

  padding: 5px;
  margin: 5px;
`;

const ModuleItem = styled.div`
  position: relative;
  border: 1px solid white;
  padding: 5px;
  margin: 5px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
`;

const ManageButton = styled.button`
  border: 1px solid white;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
`;

export const ModulesCourseList = ({ modules, handleDeleteModule, courseSelected }) => {
  return (
    <ModuleContainer>
      {modules && modules.map((module, index) => (
        <ModuleItem key={index}>
          <DeleteButton onClick={() => handleDeleteModule.mutate(module.id)}>Deletar Módulo</DeleteButton>
          <h4>{module.title}</h4>
          <ManageButton>Gerenciar</ManageButton>
        </ModuleItem>
      ))}
      <p>Criar Módulos</p>
      <AddModuleModal courseId={courseSelected.id} />
    </ModuleContainer>
  );
};