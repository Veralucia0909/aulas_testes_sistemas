import { soma } from "./calculadora.js";

test("soma de 2 numeros: ", () => {
    const resultado = soma(10, 10);


    expect(resultado).toBe(20);
})

console.log("soma: ", !");