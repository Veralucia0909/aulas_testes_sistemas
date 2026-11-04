import * as chai from "chai";
import { request, default as chaiHttp} from "chai-http";

chai.use(chaiHttp);

const { expect } = chai;

// test("Deve retornar status 200 para GET /posts", () => {
//     const url = "https://jsonplaceholder.typicode.com";
//     request(url).get("/posts").end((err, res) => {
//         expect(res.status).to.equal(200);
//     });
// });

describe("Testes de API", () => {
    const url = "https://jsonplaceholder.typicode.com";

    it("Deve retornar status 200 para GET /posts", async () => {
        const res = await request.execute(url).get("/posts");
        expect(res.status).equal(200);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(100);
    });
});