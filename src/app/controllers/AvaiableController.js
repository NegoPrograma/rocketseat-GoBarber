import {
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
} from 'date-fns';
import {
    Op
} from 'sequelize';
import Appointment from '../models/Appointment';

class AvaiableController {
    async index(req, res) {
        const {
            date
        } = req.query;
        if (!date) {
            res.status(400).json({
                error: 'date not provided.',
            });
        }

        const searchDate = Number(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.params.provider_id,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(searchDate),
                        endOfDay(searchDate),
                    ],
                },
            },
        });

        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];

        const avaiable = schedule.map((time) => {
            const [hour,minute] = time.split(':');
            const value = setSeconds(setMinutes(),0)
        });

        return res.json();
    }
}

export default new AvaiableController();
