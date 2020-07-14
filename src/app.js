import express from 'express';
import path from 'path';
import routes from './routes';
import './database/ModelLoader';

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
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
