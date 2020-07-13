import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation failed.' });
        }


        const userExists = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (userExists)
            return res.status(400).json({
                error: 'User already exists!',
            });

        const { id, name, email, provider } = await User.create(req.body);
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) => {
                    if (oldPassword) {
                        return field.required();
                    }
                    return field;
                }),
            password_confirm: Yup.string().when(
                'password',
                (password, field) => {
                    if (password) {
                        return field.required().oneOf([Yup.ref('password')]);
                    }
                    return field;
                }
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation failed.' });
        }

        const { email, oldPassword } = req.body;

        // find by primary key
        const user = await User.findByPk(req.userId);
        // caso ele esteja tentando alterar o email
        // para um email já existente.
        if (email && email !== user.email) {
            const userExists = await User.findOne({
                where: {
                    email,
                },
            });

            if (userExists)
                return res.status(400).json({
                    error: 'User already exists!',
                });
        }

        if (oldPassword)
            if (!(await user.checkPassword(oldPassword))) {
                return res.status(401).json({
                    error: "Passwords doesn't match.",
                });
            }

        const { id, name, provider } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
            provider,
        });
    }
}

export default new UserController();
