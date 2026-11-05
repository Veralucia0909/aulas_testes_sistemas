const axios = require('axios');
const Users = require('./users');

// Mock de Módulo (Substitui a execução do módulo completo)
jest.mock('axios');

test('Deve retornar a lista de usuários', async () => {
    const users = [{name: 'Bob'}];

    // Se o axios for um mock retorno o objeto ao chamar o Get
    axios.get.mockResolvedValue({data: users});
    return Users.all().then(data => expect(data).toBe(users));
});