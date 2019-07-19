import * as Yup from 'yup';
import {
  parseISO,
  startOfDay,
  endOfDay,
  startOfHour,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1, date } = req.query;
    const parseDate = parseISO(date);
    const meetup = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
      attributes: ['id', 'title', 'description', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['url', 'path', 'id'],
        },
      ],
    });

    return res.json(meetup);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, location, date, banner_id } = req.body;

    // verificar se data não já passou
    const houerStart = startOfHour(parseISO(req.body.date));

    if (isBefore(houerStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // verificar se o banner existe
    const bannerExists = await File.findOne({
      where: { id: req.body.banner_id },
    });

    if (!bannerExists)
      return res.status(400).json({ error: 'Banner does not exists.' });

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      banner_id,
      user_id: req.userId,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id } = req.params;

    const currentMeetup = await Meetup.findOne({
      where: {
        id,
      },
    });

    if (!currentMeetup) {
      return res.status(404).json({ error: 'Meetup not found.' });
    }

    const houerStart = startOfHour(currentMeetup.date);
    if (isBefore(houerStart, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can not change a meetup that has passed.' });
    }

    if (req.userId !== currentMeetup.user_id) {
      return res
        .status(401)
        .json({ error: 'You can only change meetups created by you.' });
    }

    const bannerExists = await File.findOne({
      where: { id: req.body.banner_id },
    });

    if (!bannerExists)
      return res.status(400).json({ error: 'Banner does not exists.' });

    const meetup = await currentMeetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const { id } = req.params;

    const currentMeetup = await Meetup.findOne({
      where: {
        id,
      },
    });

    if (!currentMeetup) {
      return res.status(404).json({ error: 'Meetup not found.' });
    }

    const houerStart = startOfHour(currentMeetup.date);
    if (isBefore(houerStart, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can not delete a meetup that has passed.' });
    }

    if (req.userId !== currentMeetup.user_id) {
      return res
        .status(401)
        .json({ error: 'You can only delete meetups created by you.' });
    }

    const meetup = await currentMeetup.destroy();

    return res.json(meetup);
  }
}

export default new MeetupController();
