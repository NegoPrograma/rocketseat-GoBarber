import 'dotenv/config'; // adiciona os valores de .env para process.env
import Queue from './lib/Queue';

Queue.processQueue();
