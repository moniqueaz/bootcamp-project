/**
 * O usuário pode cadastrar meetups na plataforma com
 *
 * título do meetup,
 * descrição,
 * localização,
 * data e hora
 * imagem (banner).
 *
 * Todos campos são
 * obrigatórios. Adicione também um campo
 *
 * user_id
 *
 * que armazena o ID do usuário
 * que organiza o evento.
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetapps', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      banner_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allwNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allwNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('meetapps');
  },
};
