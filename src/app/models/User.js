import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        // Sequelize.VIRTUAL são tipos de dados que não são salvos no DB.
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );
        /**
         * hooks são como callbacks no sentido de que executam após um certo
         * evento ocorrer. Abaixo, estamos descrevendo um evento que ocorre
         * beforeSave, ou seja, antes de salvar um dado no BD.
         */
        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });
        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
