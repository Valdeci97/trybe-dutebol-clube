import { compareSync } from 'bcryptjs';

import User from '../database/models/Users';
import JWT from '../helpers/jwt';
import ILoginError from '../interfaces/loginError';
import ILoginSucess from '../interfaces/loginSucess';

class LoginService {
  private _user;

  constructor() { this._user = User; }

  public async login(email: string, password: string):
  Promise<[number, ILoginError | ILoginSucess]> {
    const user = await this._user.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
      return [401, { message: 'Incorrect email or password' }];
    }
    const token = JWT.generateToken(user);
    return [200, {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      token,
    }];
  }
}

export default new LoginService();
