import { compareSync } from 'bcryptjs';

import User from '../database/models/Users';
import JWT from '../helpers/jwt';

class LoginService {
  private _user;

  constructor() { this._user = User; }

  public async login(email: string, password: string) {
    const user = await this._user.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
      return { status: 401, message: 'Incorrect email or password' };
    }
    const tokenData = { id: user.id, username: user.username, role: user.role, email };
    const token = JWT.generateToken(tokenData);
    return {
      user: tokenData,
      token,
    };
  }

  public getRoleByToken = (token: string) => JWT.verifyToken(token) as User;
}

export default new LoginService();
