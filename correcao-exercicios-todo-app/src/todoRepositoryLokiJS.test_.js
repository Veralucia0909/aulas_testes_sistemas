import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockInsertOne = jest.fn();
const mockFind = jest.fn();
const mockAddCollection = jest.fn();

jest.unstable_mockModule('lokijs', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            addCollection: mockAddCollection,
        })),
    };
});

const { default: TodoRepository } = await import('./todoRepository.js');
const loki = (await import('lokijs')).default;

describe('TodoRepository with LokiJS module mock', () => {
    let todoRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        mockAddCollection.mockReturnValue({
            insertOne: mockInsertOne,
            find: mockFind,
        });

        todoRepository = new TodoRepository({ db: new loki('todo', {}) });
    });

    describe('create', () => {
        it('deve adicionar um novo item à lista', async () => {
            const todoItem = {
                text: 'Learn Node.js',
                when: new Date(),
                status: '',
                id: 'todo-1',
            };

            mockInsertOne.mockResolvedValue(todoItem);

            const result = await todoRepository.create(todoItem);

            expect(mockAddCollection).toHaveBeenCalledWith('schedule');
            expect(mockInsertOne).toHaveBeenCalledWith(todoItem);
            expect(result).toEqual(todoItem);
        });
    });

    describe('list', () => {
        it('deve retornar todos os itens da lista', async () => {
            const when1 = new Date('2024-01-01T00:00:00.000Z');
            const when2 = new Date('2024-01-02T00:00:00.000Z');

            const todoItems = [
                {
                    text: 'todo 1',
                    when: when1,
                    status: '',
                    id: 'todo-1',
                },
                {
                    text: 'todo 2',
                    when: when2,
                    status: '',
                    id: 'todo-2',
                },
            ];

            mockFind.mockReturnValue(todoItems);

            const result = await todoRepository.list();

            expect(mockFind).toHaveBeenCalledTimes(1);
            expect(result).toEqual(todoItems);
        });
    });
});
