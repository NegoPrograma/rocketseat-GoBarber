export default {
    /**
     * abaixo, informações de pré
     * configuração do nosso token.
     * Todo token JWT deve ter
     * um artíficio de assinatura
     * única chamado secret.
     * já o expiresIn é opcional,
     * apenas diz durante
     * quanto tempo esse token
     * é válido.
     */
    secret: process.env.APP_SECRET,
    expiresIn: '7d',
};
