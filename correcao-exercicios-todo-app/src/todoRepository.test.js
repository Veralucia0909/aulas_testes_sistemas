import TodoRepository from './todoRepository.js';
import Todo from './todo.js';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockInsertOne = jest.fn();
const mockFind = jest.fn();

describe('TodoRepository', () => {
    let todoRepository;
    let mockDb;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            addCollection: jest.fn().mockReturnValue({
                insertOne: mockInsertOne,
                find: mockFind,
            }),
        };

        todoRepository = new TodoRepository({ db: mockDb });
    });

    describe('create', () => {
        it('deve adicionar um novo item à lista', async () => {
            const todoItem = new Todo({
                text: 'Learn Node.js',
                when: new Date()
            });

            mockInsertOne.mockResolvedValue(todoItem);

            const result = await todoRepository.create(todoItem);

            expect(mockDb.addCollection).toHaveBeenCalledWith('schedule');
            expect(mockInsertOne).toHaveBeenCalledWith(todoItem);
            expect(result).toEqual(todoItem);
        });
    });

    describe('list', () => {
        it('deve retornar todos os itens da lista', async () => {
            const when1 = new Date('2024-01-01T00:00:00.000Z');
            const when2 = new Date('2024-01-02T00:00:00.000Z');

            const todoItems = [
                new Todo({ text: 'todo 1', when: when1 }),
                new Todo({ text: 'todo 2', when: when2 }),
            ];

            mockFind.mockReturnValue(todoItems);

            const result = await todoRepository.list();

            expect(mockFind).toHaveBeenCalledTimes(1);
            expect(result).toEqual(todoItems);
        });
    });
});