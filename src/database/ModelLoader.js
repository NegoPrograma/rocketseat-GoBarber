import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];
/**
 * Classe responsável por deixar os models se conectarem ao BD.
 */
class ModelLoader {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map((model) => {
            model.init(this.connection);
        });
    }
}

export default new ModelLoader();
