import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription, user } = data;
    console.log('A fila executou');
    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'subscription',
      context: {
        user: user.name,
        date: format(
          parseISO(subscription.createdAt),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new SubscriptionMail();
