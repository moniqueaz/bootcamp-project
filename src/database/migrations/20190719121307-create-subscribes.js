module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subscribes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      meetapp_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'meetups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('subscribes');
  },
};
