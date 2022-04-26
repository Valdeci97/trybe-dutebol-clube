'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      homeTeam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'home_team',
        references: { model: 'teams', key: 'id' },
      },
      homeTeamGoals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'home_team_goals',
      },
      awayTeam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'away_team',
        references: { model: 'teams', key: 'id' },
      },
      awayTeamGoals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'away_team_goals',
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('matches');
  }
};
