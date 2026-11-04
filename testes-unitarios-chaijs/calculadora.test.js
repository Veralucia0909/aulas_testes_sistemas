import { soma } from "./calculadora.js";
import { assert, expect, should} from "chai";

should();

//Mock de funcão (Substitui a execução da função soma)
//const soma = jest.fn((a,b) => 50); 

test("Soma de 2 números: ", () => {
   const resultado = soma(10, 10);
   
   // expect(resultado).toBe(20);
   expect(resultado).to.equal(20);
   assert.equal(resultado, 20, "A soma de 10 + 10 deve ser igual a 20");
   resultado.should.equal(20, "A soma de 10 + 10 deve ser igual a 20 com Should");
})

test("Soma de valores flutuantes: ", () => {
   const resultado = soma(0.2, 0.1);
   
   // expect(resultado).toBeCloseTo(0.3);
   expect(resultado).to.be.closeTo(0.3, 0.001);
   resultado.should.be.closeTo(0.3, 0.001);
})

test("Soma de Numeros deve ser maior que zero: ", () => {
   const resultado = soma(-10, 10);
   
   //expect(resultado).toBeGreaterThanOrEqual(0);
   expect(resultado).to.be.greaterThanOrEqual(0);
   resultado.should.be.greaterThanOrEqual(0);
})

test("Lista de números: ", () => {
   const numeros = [10,20,30,40,50];
   
   // expect(numeros).toContain(30);
   expect(numeros).to.contain(30);
   assert.include(numeros, 30, "O array deve conter o número 30");
   numeros.should.contain(30);
})

test("Lista de números: ", () => {
   const numeros = [10,20,30,40,50];
   
   // expect(numeros).not.toContain(60);
   expect(numeros).to.not.contain(60);
   expect(numeros).has.lengthOf(5);
});