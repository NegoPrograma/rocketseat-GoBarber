import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import databaseConfig from '../config/databaseConfig';

const models = [User, File, Appointment];
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
        models.map((model) => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

export default new ModelLoader();
