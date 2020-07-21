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
import NotificationController from './app/controllers/NotificationController';
import AvaiableController from './app/controllers/AvaiableController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.put('/users', UserController.update);

routes.get('/schedule', ScheduleController.index);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:provider_id/avaiable', AvaiableController.index);
routes.get('/notifications', NotificationController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

export default routes;
