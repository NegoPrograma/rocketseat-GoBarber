import File from '../models/File';

class FileController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file; // json gerado a partir da função de upload do multer.

        const file = await File.create({
            name,
            path,
        });

        return res.json(file);
    }
}

export default new FileController();
