import Todo from "./todo";

describe("todo válido", () => {
    it("Deve ser um Todo Válido", () => {
        const newTodo = new Todo({ text: "Learn Node.js", when: new Date() });
        const result = newTodo.isValid();
        expect(result).toBeTruthy();
    });
});

test('Deve ser um todo válido 2', () => {
    const newTodo = new Todo({ text: "Learn Node.js", when: new Date() });
    const result = newTodo.isValid();
    expect(result).toBeTruthy();
});

describe("todo inválido", () => {
    it("Deve ser um Todo Inválido sem text", () => {
        const newTodo = new Todo({ text: "", when: new Date() });
        const result = newTodo.isValid();
        expect(result).toBeFalsy();
    });

    it("Deve ser um Todo Inválido com data inválida", () => {
        const newTodo = new Todo({ text: "Learn Node.js", when: new Date("invalid date") });
        const result = newTodo.isValid();
        expect(result).toBeFalsy();
    });
}); 