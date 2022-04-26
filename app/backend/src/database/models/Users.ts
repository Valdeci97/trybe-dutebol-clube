import { Model, INTEGER, STRING } from 'sequelize';

import db from '.';

class User extends Model {
  public id!: number;

  public username!: string;

  public role!: string;

  public email!: string;

  public password!: string;
}

User.init({
  id: { type: INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  username: { type: STRING, allowNull: false, unique: true },
  role: { type: STRING, allowNull: false },
  email: { type: STRING, allowNull: false, unique: true },
  password: { type: STRING, allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'user',
  timestamps: false,
  tableName: 'users',
});

export default User;
