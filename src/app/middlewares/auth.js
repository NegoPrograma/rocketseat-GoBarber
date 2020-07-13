import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import auth from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({
            error: 'token not provided.',
        });
    }
    /**
     * autheader: string "bearer pjqepgoh13o4h1"
     * como nosso token é montado dessa forma, pegamos
     * o valor usando desestruturação. a virgula diz que
     * devemos descartar a primeira posição.
     * já o segundo parametro diz que agora temos uma
     * variavel chamada token e ela recebe a posição [1] do split.,
     *      */
    const [, token] = authHeader.split(' ');

    try {
        /**
         * promisify é uma lib interna que te permite transformar funções
         * de callback em funções async/await.
         * jwt.verify é um método que recebe o seu token
         * e o código secreto pra validar ele.
         * Se estiver válido, retorna então o json decodificado
         * com as informações de payload
         */
        const decoded = await promisify(jwt.verify)(token, auth.secret);
        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({
            error: 'token is invalid.',
        });
    }
};
