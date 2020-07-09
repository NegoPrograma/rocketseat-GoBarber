const express = require('express');
const routes = require('./routes');

class App {
    //método executado em instância
    constructor(){
        this.server = express();
        this.middlewares();
        this.routes();
    }
    /*
    o método middlewares serve para configurar
    características específicas sobre os middlewares
    */
    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);

    }
}

module.exports = new App().server;