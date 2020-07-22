import Sequelize from 'sequelize';
import mongoose from 'mongoose';
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
        this.mongo();
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

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

export default new ModelLoader();
