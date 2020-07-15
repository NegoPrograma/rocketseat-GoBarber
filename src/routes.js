import Router from 'express';
import multer from 'multer';

import multerConfig from './config/multerConfig';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import auth from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(auth);
routes.get('/schedule', ScheduleController.index);
routes.get('/providers', ProviderController.index);
routes.get('/appointments', AppointmentController.index);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentController.store);
export default routes;
