import { Model, INTEGER, STRING } from 'sequelize';

import db from '.';

class Teams extends Model {
  public id!: number;

  public teamName: string;
}

Teams.init({
  id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
  teamName: { type: STRING, allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});
