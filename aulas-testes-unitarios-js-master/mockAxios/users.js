// users.js
const axios = require('axios');

class Users {
  static all() {
    return axios.get('https://jsonplaceholder.typicode.com/users').then(resp => resp.data);
  }
}

module.exports = Users;