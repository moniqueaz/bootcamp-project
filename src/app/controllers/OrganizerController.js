import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class OrganizerController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const meetup = await Meetup.findAll({
      where: {
        user_id: req.userId,
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

    return res.json(meetup);
  }
}

export default new OrganizerController();
