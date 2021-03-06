import 'dotenv/config'; // adiciona os valores de .env para process.env
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import './database/ModelLoader';
import sentryConfig from './config/sentry';

class App {
    // método executado em instância
    constructor() {
        this.server = express();
        Sentry.init(sentryConfig);
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    /*
    o método middlewares serve para configurar
    características específicas sobre os middlewares
    */
    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
        // o express já identifica que um middleware de 4 params
        // é um middleware de exceptions.
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }
            return res.status(500).json({
                error: 'internal server error.',
            });
        });
    }
}

export default new App().server;
