import Router from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'isaac',
        email: 'email@top.com',
        password_hash: '123',
    });

    res.json(user);
});

export default routes;
