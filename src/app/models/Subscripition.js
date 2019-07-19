import { Model, Sequelize } from 'sequelize';

class Subscribe {
  static init(sequelize) {
    super.init({}, sequelize);
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Subscribe;
