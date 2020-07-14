import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import auth from '../../config/jwtConfig';
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation failed.' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: "User doesn't exist." });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Passwords doesn't match." });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            /**
             * Aqui definimos o nosso token usando a função sign da biblioteca jwt.
             * o primeiro parâmetro é o seu payload, o segundo é a assinatura única
             * da sua aplicação, o terceiro parâmetro é opcional, são configurações
             * especificas que seu jwt tem.
             */
            token: jwt.sign({ id }, auth.secret, {
                expiresIn: auth.expiresIn,
            }),
        });
    }
}

export default new SessionController();
