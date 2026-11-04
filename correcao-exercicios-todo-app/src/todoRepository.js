
export default class TodoRepository {
    #schedule
    constructor({ db }) {
        this.#schedule = db.addCollection('schedule')
    }

    async list() {
        console.log("Entrou no list do repository")
        // deveria ser um .project() mas não temos no lokijs
        return this.#schedule.find().map(({ meta, $loki, ...result }) => result)
    }

    async create(data) {
        console.log("Entrou no create do repository")
        return this.#schedule.insertOne(data)
    }
}



// const c = new TodoRepository()

// c.create({ name: 'XuxaDaSilva', age: 90})
// c.create({ name: 'Joaozinho', age: 90})

// console.log('list', c.list())