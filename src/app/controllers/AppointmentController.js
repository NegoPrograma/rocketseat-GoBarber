import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from "../../lib/Queue";
import CancellationMail from "../jobs/CancellationMail";
class AppointmentController {

    async index(req, res) {
        const { page = 1 } = req.query;
        const appointments = await Appointment.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            attributes: ['id', 'date'],
            order: ['date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });
        return res.json(appointments);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'validation failed.',
            });
        }

        const { provider_id, date } = req.body;

        /**
         * Check if the provided id really belongs
         * to a provider.
         */
        const isProvider = await User.findOne({
            where: {
                id: provider_id,
                provider: true,
            },
        });
        if (!isProvider) {
            return res.status(401).json({
                error: 'The chosen user is not a service provider!',
            });
        }
        /**
         * This may be silly, but i'm checking if the user isn't actually
         * trying to appoint a service with him or herself.
         */
        if (req.userId === provider_id) {
            return res.status(401).json({
                error: 'You cannot appoint a service with yourself!',
            });
        }

        /**
         * startofhour funciona equivalente a um math.floor
         * mas pra horas. retira os min e segundos.
         * parseISO transforma a string date em um
         * Date object.
         */
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res.status(401).json({
                error: 'your appointment time has already passed!',
            });
        }

        /**
         * Check if provider has an appointment already set
         * with the time chosen by user.
         */
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });
        if (checkAvailability) {
            return res.status(401).json({
                error: 'Appointment time not avaiable.',
            });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: hourStart,
        });

        /**
         * Notify appointment.
         */
        const user = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {
                locale: pt,
            }
        );
        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        });
        return res.json(appointment);
    }

    async delete(req, res) {
        const { id } = req.params;

        const appointment = await Appointment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
        });

        if (!appointment) {
            return res.status(401).json({
                error: 'Appointment does not exist.',
            });
        }
        if (appointment.user_id !== req.userId) {
            return res.status(401).json({
                error: 'You can only cancel appointments made by you.',
            });
        }

        const maxHourPermittedForCancel = subHours(appointment.date, 2);
        const now = new Date();

        if (isBefore(maxHourPermittedForCancel, now)) {
            return res.status(401).json({
                error:
                    'You can only cancel appointments with 2 hours of advance.',
            });
        }

        appointment.canceled_at = now.toUTCString();

        await appointment.save();
        /**
         * send email notifying provider of service cancel.
         */
        await Queue.add(CancellationMail.key, {
            appointment,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
