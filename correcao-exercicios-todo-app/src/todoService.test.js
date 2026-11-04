import Todo from './todo.js';
import TodoService from './todoService.js';
import {jest} from '@jest/globals';
// import TodoRepository from "./todoRepository.js"
// import loki from 'lokijs'


describe('TodoService', () => {
    let todoService;
    let mockTodoRepository;

    beforeEach(() => {
        mockTodoRepository = {
            create: jest.fn(),
            list: jest.fn()
        };

        // const db = new loki('todo', {})
        // const mockTodoRepository = new TodoRepository({ db })
        todoService = new TodoService({ todoRepository: mockTodoRepository });
    });

    describe('list', () => {
        it('Deve retornar uma lista de tarefas com o texto em maiúsculas', async () => {
            const todo1 = new Todo({ text: 'todo 1', when: new Date() });
            const todo2 = new Todo({ text: 'todo 2', when: new Date() });
            const mockTodos = [
                todo1,
                todo2
            ];
            
            // const mockTodos = [
            //     new Todo({ text: 'todo 1', when: new Date() }),
            //     new Todo({ text: 'todo 2', when: new Date() })
            // ];
            mockTodoRepository.list.mockResolvedValue(mockTodos);
            const result = await todoService.list();

            // result.forEach((todo, index) => {
            //     expect(todo.text).toBe(mockTodos[index].text.toUpperCase());
            //     expect(todo.when).toBe(mockTodos[index].when);
            // });

            expect(result).toEqual([
                {...todo1, text: todo1.text.toUpperCase()},
                {...todo2, text: todo2.text.toUpperCase()}
            ]);
        });
    });

    describe('create', () => {
        it('Deve retornar um erro para um item de tarefa inválido', () => {
            const invalidTodoItem = new Todo({ text: '', when: new Date() });
            const result = todoService.create(invalidTodoItem);
            expect(result).toEqual({
                error: {
                    message: 'invalid data',
                    data: invalidTodoItem
                }
            });
        });

        it('Deve chamar o método create do repositório para um item de tarefa válido', () => {
            const validTodoItem = new Todo({ text: 'Learn Node.js', when: new Date() });
            todoService.create(validTodoItem);
            expect(mockTodoRepository.create).toHaveBeenCalled();
        });

        it('Deve retornar o item criado para um item de tarefa válido', async() => {
            const validTodoItem = new Todo({ text: 'Learn Node.js', when: new Date() });
            mockTodoRepository.create.mockResolvedValue(validTodoItem);
            const todoCriado = await todoService.create(validTodoItem);
            expect(todoCriado).toEqual(validTodoItem);
        });
    });
    
    
});