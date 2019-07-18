import * as Yup from 'yup';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetapp from '../models/Meetapp';
import User from '../models/User';
import File from '../models/File';

class MeetappController {
  async index(req, res) {
    const { page = 1, date } = req.query;
    const parseDate = parseISO(date);
    const meetapp = await Meetapp.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
      attributes: ['title', 'description', 'date'],
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

    return res.json(meetapp);
  }

  async store(req, res) {}

  async update(req, res) {}

  async delete(req, res) {}

  async show(req, res) {}
}

export default new MeetappController();
