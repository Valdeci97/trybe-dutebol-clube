import User from '../database/models/Users';

class LoginService {
  private user;

  constructor() { this.user = User; }

  public async login(email: string, _password: string): Promise<void> {
    const result = await this.user.findOne({ where: { email } });
    console.log(result);
  }
}

export default new LoginService();
