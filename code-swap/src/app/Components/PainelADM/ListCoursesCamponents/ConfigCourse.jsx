import styled from 'styled-components';

const ButtonUpdate = styled.button`
  padding: 5px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: 'blue';
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: flex-start;
  margin-top: '5px';
  width: 'auto';
  border: '1px solid black';
`;

const ThumbnailLabel = styled(Label)`
  flex-direction: column;
  margin-right: 10px;
`;

const ThumbnailImage = styled.img`
  src: ${props => props.src};
  alt: "imagem";
`;

const TextArea = styled.textarea`
  color: black;
  margin: 5px;
  height: 10rem;
  width: 100%;
`;

const CourseConfigurations = styled.div`
  border: 1px solid white;
  padding: 5px;
  margin: 5px;
`;

const CourseConfigurationsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
`;

const CourseConfigurationsSection = styled.div`
  width: 30%;
  margin-left: 10px;
`;

// ...

export const ConfigCourse = ({ courseSelected, setPainelUpdateCourse, isPremium, handleCheckboxChange, isSequential, handleCheckboxChangeSequential, experienceCourse, setExperienceCourse, codesCourse, setCodesCourse, difficulty, handleSelectChange, courseObservations, setCourseObservations, handleUpdateThumbnail, handleUpdateCover, handleConfigCourse, handleSetStatusCourse, statusCourse }) => {
  return (
    <div>
      <h4>Descrição: </h4>
      <p>{courseSelected.description}</p>
      <button style={{ backgroundColor: '#16ff66', padding: '5px', borderRadius: '5px' }} onClick={() => setPainelUpdateCourse(true)}>Atualizar informações</button>

      <CourseConfigurations>
        <CourseConfigurationsContainer>

          <CourseConfigurationsSection>
            <Label>Criador:<span type="text" >{courseSelected.owner}</span></Label>
            <Label>Status:<span type="text" >{courseSelected.status}</span></Label>
            <select style={{ color: 'black' }} onChange={handleSetStatusCourse} value={statusCourse}>
              <option value="approved">Aprovado</option>
              <option value="pending">Pendente</option>
              <option value="revision">Revisão</option>
              <option value="rejected">Rejeitado</option>
            </select>
            <Label>Curso premium?<input type="checkbox" checked={isPremium} onChange={handleCheckboxChange} /></Label>
            <Label>Módulos sequenciais?<input type="checkbox" checked={isSequential} onChange={handleCheckboxChangeSequential} /></Label>
            <Label >XP do curso:<input type="number" style={{ width: '100px', color: "black" }} value={experienceCourse} onChange={(e) => setExperienceCourse(e.target.value)} /></Label>
            <Label >Codes do curso:<input type="number" style={{ width: '100px', color: "black" }} value={codesCourse} onChange={(e) => setCodesCourse(e.target.value)} /></Label>
            <Label >Nível de dificuldade do curso:
              <select style={{ color: 'black' }} value={difficulty} onChange={handleSelectChange}>
                <option value="iniciante">Iniciante</option>
                <option value="intermediário">Intermediário</option>
                <option value="avançado">Avançado</option>
              </select>
            </Label>
            <ThumbnailLabel width='60%' border='1px solid white'>Thumbnail<ThumbnailImage src={courseSelected.imgUrlThumbnail} /></ThumbnailLabel>

            <div>
              <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar Thumbnail:</label>
              <form onSubmit={handleUpdateThumbnail} >
                <input type="file" name="file" />
                <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px' }} type="submit">Enviar</button>
              </form>
              <br />
            </div>

            <div>
              <TextArea type="text" placeholder="Observações do Curso" value={courseObservations} onChange={(e) => setCourseObservations(e.target.value)} />
              <button style={{ backgroundColor: '#16ff66', padding: '5px', borderRadius: '5px' }} onClick={() => handleConfigCourse()}>Salvar Curso</button>
            </div>
          </CourseConfigurationsSection>

          <ThumbnailLabel width='60%' border='1px solid white'>
            Capa do Curso
            <ThumbnailImage src={courseSelected.imgUrlCover} />

            <div>
              <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar capa do curso:</label>
              <form onSubmit={handleUpdateCover} >
                <input type="file" name="file" />
                <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px' }} type="submit">Enviar</button>
              </form>
            </div>
          </ThumbnailLabel>
        </CourseConfigurationsContainer>
      </CourseConfigurations>
    </div>
  );
};