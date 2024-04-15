import React, {  useState } from 'react';
import { ChangePermissionUser } from '../../../database/functions/ChangePermissionUser';

const UserList = ({ users  }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);

    function handleUserClick(user) {
        setSelectedUser(user);
    }

    function handleChangePermission() {
        if (selectedUser && selectedPermission) {
            ChangePermissionUser(selectedUser.id, selectedPermission);
        }
        
    }

   
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
            <h2>Lista de Usuários:</h2>
            <ul>
                {users ? users.map(user => (
                    <li key={user.id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                        {user.data.userName}
                    </li>
                )) : null}
            </ul>
            {selectedUser && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Informações do Usuário:</h3>
                    <p><strong>Nome de Usuário:</strong> {selectedUser.data.userName}</p>
                    <p><strong>Códigos:</strong> {selectedUser.data.codes}</p>
                    <p><strong>E-mail:</strong> {selectedUser.data.email}</p>
                    <p><strong>Telefone:</strong> {selectedUser.data.phone}</p>
                    <p><strong>WhatsApp:</strong> {selectedUser.data.whatsapp ? 'Sim' : 'Não'}</p>
                    <p><strong>Pontos de Experiência:</strong> {selectedUser.data.xp}</p>
                    <p><strong>Nível permissão:</strong> {selectedUser.data.permissions}</p>
                    <label htmlFor="permission">Alterar Permissão:</label>
                    <select id="permission" onChange={(e) => setSelectedPermission(e.target.value)}>
                        <option value="">Selecione...</option>
                        <option value="1">Nível 1</option>
                        <option value="2">Nível 2</option>
                        <option value="3">Nível 3</option>
                        <option value="4">Nível 4</option>
                    </select>
                    <button onClick={handleChangePermission} style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Alterar Permissão</button>
                </div>
            )}
        </div>
    );
};

export default UserList;
