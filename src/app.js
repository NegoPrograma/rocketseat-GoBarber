import express from 'express';
import routes from './routes';
import './database';

class App {
    // método executado em instância
    constructor() {
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

export default new App().server;
