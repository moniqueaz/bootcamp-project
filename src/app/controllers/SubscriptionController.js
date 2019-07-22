import { format, pt } from 'date-fns';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Notification from '../schemas/Notifications';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const { id } = req.params;
    const meetup = await Meetup.findByPk(id);

    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You can not sign up for your own meeting.' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    const checkDateAndSubscription = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDateAndSubscription) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time." });
    }

    const subscription = await Subscription.create({
      meetup_id: id,
      user_id: req.userId,
    });

    /**
     * Notification
     */

    const user = await User.findByPk(req.userId);
    const formatDate = format(meetup.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Nova inscrição de ${user.name} <${user.email}> para a Meetup ${meetup.title} no ${formatDate}`,
      user: meetup.user_id,
    });

    return res.json(subscription);
  }

  async delete(req, res) {}
}

export default new SubscriptionController();
