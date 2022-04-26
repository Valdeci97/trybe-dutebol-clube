import { Model, INTEGER, BOOLEAN } from 'sequelize';

import db from '.';
import Team from './Teams';

class Match extends Model {
  public id!: number;

  public homeTeam!: number;

  public homeTeamGoals!: number;

  public awayTeam!: number;

  public awayTeamGoals!: number;

  public inProgress!: boolean;
}

Match.init({
  id: { type: INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  homeTeam: { type: INTEGER, allowNull: false },
  homeTeamGoals: { type: INTEGER, allowNull: false, defaultValue: 0 },
  awayTeam: { type: INTEGER, allowNull: false },
  awaiTeamGoals: { type: INTEGER, allowNull: false, defaultValue: 0 },
  inProgress: { type: BOOLEAN, allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
  tableName: 'matches',
});

Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'awayTeam' });

Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'match' });
Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'match' });

// Tem de ficar aqui pois quando fiz as duas linhas acima no model Teams foi acusado dependência cíclica;

export default Match;
