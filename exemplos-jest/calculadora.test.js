//import { soma } from "./calculadora.js";
const soma = require('./calculadora.js')

//Mock de funcão (Substitui a execução da função soma)
//const soma = jest.fn((a,b) => 50); 

test("Soma de 2 números: ", () => {
   const resultado = soma(10, 10);
   
   expect(resultado).toBe(20);
})

test("Soma de valores flutuantes: ", () => {
   const resultado = soma(0.2, 0.1);
 //console.log("resultado ", resultado);
   
   expect(resultado).toBeCloseTo(0.3);
})

test("Soma de Numeros deve ser maior que zero: ", () => {
   const resultado = soma(-10, 10);
   
   expect(resultado).toBeGreaterThanOrEqual(0);
})

test("Lista de números: ", () => {
   const numeros = [10,20,30,40,50];
   
   expect(numeros).toContain(30);
})

test("Lista de números: ", () => {
   const numeros = [10,20,30,40,50];
   
   expect(numeros).not.toContain(60);
})